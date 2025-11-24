import * as ort from 'onnxruntime-web';

// Disease class names (must match training order)
export const CLASS_NAMES = ['Healthy', 'Mosaic', 'Redrot', 'Rust', 'Yellow'];

// Disease information and treatment recommendations
export const DISEASE_INFO = {
  Healthy: {
    color: '#10b981',
    icon: '✓',
    description: 'The leaf appears healthy with no visible disease symptoms.',
    treatment: 'Continue regular crop maintenance and monitoring.'
  },
  Mosaic: {
    color: '#f59e0b',
    icon: '⚠',
    description: 'Mosaic disease causes yellowing and stunted growth.',
    treatment: 'Remove infected plants, control aphid vectors, use resistant varieties.'
  },
  Redrot: {
    color: '#ef4444',
    icon: '✗',
    description: 'Redrot causes reddening of leaves and stem rot.',
    treatment: 'Improve drainage, use fungicides, remove infected stalks, crop rotation.'
  },
  Rust: {
    color: '#d97706',
    icon: '!',
    description: 'Rust disease causes orange-brown pustules on leaves.',
    treatment: 'Apply fungicides, remove infected leaves, ensure proper spacing.'
  },
  Yellow: {
    color: '#eab308',
    icon: '⚠',
    description: 'Yellow leaf disease causes yellowing and leaf death.',
    treatment: 'Control aphid vectors, use resistant varieties, remove infected plants.'
  }
};

let session = null;

/**
 * Load the ONNX model with timeout
 * @param {string} modelPath - Path to the ONNX model file
 * @param {number} timeout - Timeout in milliseconds (default: 15000)
 */
export async function loadModel(modelPath, timeout = 15000) {
  try {
    console.log('Loading ONNX model from:', modelPath);

    // Configure ONNX Runtime to use local WASM files (China-friendly)
    ort.env.wasm.wasmPaths = '/onnx-wasm/';
    ort.env.wasm.numThreads = 1; // Use single-threaded for compatibility

    // Create model loading promise
    const loadPromise = ort.InferenceSession.create(modelPath, {
      executionProviders: ['wasm'],
      graphOptimizationLevel: 'all'
    });

    // Create timeout promise
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Model loading timeout (15s)')), timeout);
    });

    // Race between loading and timeout
    session = await Promise.race([loadPromise, timeoutPromise]);

    console.log('Model loaded successfully!');
    return true;
  } catch (error) {
    console.error('Error loading model:', error);
    throw new Error('Failed to load model: ' + error.message);
  }
}

/**
 * Preprocess image for model input
 * @param {HTMLImageElement} image - Input image element
 * @returns {ort.Tensor} Preprocessed tensor
 */
function preprocessImage(image) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  // YOLO expects 224x224 input
  canvas.width = 224;
  canvas.height = 224;

  // Draw and resize image
  ctx.drawImage(image, 0, 0, 224, 224);

  // Get image data
  const imageData = ctx.getImageData(0, 0, 224, 224);
  const { data } = imageData;

  // Convert to float32 array and normalize to [0, 1]
  const float32Data = new Float32Array(3 * 224 * 224);

  // ONNX expects CHW format (channels, height, width)
  // and normalized RGB values [0, 1]
  for (let i = 0; i < 224 * 224; i++) {
    float32Data[i] = data[i * 4] / 255.0;           // R
    float32Data[224 * 224 + i] = data[i * 4 + 1] / 255.0;  // G
    float32Data[2 * 224 * 224 + i] = data[i * 4 + 2] / 255.0; // B
  }

  // Create tensor [1, 3, 224, 224]
  return new ort.Tensor('float32', float32Data, [1, 3, 224, 224]);
}

/**
 * Run inference on an image
 * @param {string|File} imageSource - Image URL or File object
 * @returns {Promise<Object>} Prediction results
 */
export async function classifyImage(imageSource) {
  if (!session) {
    throw new Error('Model not loaded. Call loadModel() first.');
  }

  try {
    // Load image
    const img = new Image();
    img.crossOrigin = 'anonymous';

    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;

      if (typeof imageSource === 'string') {
        img.src = imageSource;
      } else {
        img.src = URL.createObjectURL(imageSource);
      }
    });

    // Preprocess
    const tensor = preprocessImage(img);

    // Run inference
    const startTime = performance.now();
    const results = await session.run({ images: tensor });
    const inferenceTime = performance.now() - startTime;

    // Get output tensor (logits)
    const output = results[session.outputNames[0]];
    const predictions = output.data;

    // Apply softmax to get probabilities
    const maxLogit = Math.max(...predictions);
    const expScores = Array.from(predictions).map(x => Math.exp(x - maxLogit));
    const sumExp = expScores.reduce((a, b) => a + b, 0);
    const probabilities = expScores.map(x => x / sumExp);

    // Get top prediction
    const topIndex = probabilities.indexOf(Math.max(...probabilities));
    const confidence = probabilities[topIndex];

    // Get all predictions sorted
    const allPredictions = CLASS_NAMES.map((name, i) => ({
      disease: name,
      confidence: probabilities[i],
      info: DISEASE_INFO[name]
    })).sort((a, b) => b.confidence - a.confidence);

    return {
      disease: CLASS_NAMES[topIndex],
      confidence: confidence,
      confidencePercent: (confidence * 100).toFixed(2),
      allPredictions: allPredictions,
      inferenceTime: inferenceTime.toFixed(1),
      info: DISEASE_INFO[CLASS_NAMES[topIndex]]
    };

  } catch (error) {
    console.error('Error during classification:', error);
    throw new Error('Classification failed: ' + error.message);
  }
}

/**
 * Check if model is loaded
 * @returns {boolean} True if model is loaded
 */
export function isModelLoaded() {
  return session !== null;
}
