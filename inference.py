#!/usr/bin/env python3
"""
Sugarcane Disease Classification - Inference Script

This script demonstrates how to use the trained YOLO model
for sugarcane disease classification on new images.

Usage:
    # Single image
    python inference.py --model models/best.pt --image test_leaf.jpg

    # Batch inference
    python inference.py --model models/best.pt --folder test_images/

    # Using TFLite model
    python inference.py --model models/best.tflite --image test_leaf.jpg --tflite
"""

import argparse
from pathlib import Path
from typing import List, Tuple
import time

try:
    from ultralytics import YOLO
    ULTRALYTICS_AVAILABLE = True
except ImportError:
    ULTRALYTICS_AVAILABLE = False
    print("⚠️  Warning: ultralytics not installed. PyTorch inference unavailable.")

try:
    import tensorflow as tf
    import numpy as np
    from PIL import Image
    TFLITE_AVAILABLE = True
except ImportError:
    TFLITE_AVAILABLE = False
    print("⚠️  Warning: tensorflow not installed. TFLite inference unavailable.")


# Disease class names
CLASS_NAMES = {
    0: 'Healthy',
    1: 'Mosaic',
    2: 'Redrot',
    3: 'Rust',
    4: 'Yellow'
}


def pytorch_inference(model_path: str, image_path: str, verbose: bool = True) -> Tuple[str, float]:
    """
    Run inference using PyTorch YOLO model.

    Args:
        model_path: Path to .pt model file
        image_path: Path to input image
        verbose: Print detailed results

    Returns:
        Tuple of (predicted_class, confidence)
    """
    if not ULTRALYTICS_AVAILABLE:
        raise ImportError("ultralytics package required for PyTorch inference")

    # Load model
    if verbose:
        print(f"🤖 Loading model: {model_path}")
    model = YOLO(model_path)

    # Run inference
    if verbose:
        print(f"🔮 Running inference on: {image_path}")

    start_time = time.time()
    results = model(image_path, verbose=False)
    inference_time = (time.time() - start_time) * 1000  # Convert to ms

    # Extract results
    probs = results[0].probs
    predicted_class_id = probs.top1
    predicted_class = CLASS_NAMES[predicted_class_id]
    confidence = probs.top1conf.item()

    if verbose:
        print(f"\n{'='*50}")
        print(f"📊 RESULTS")
        print(f"{'='*50}")
        print(f"Predicted Class: {predicted_class}")
        print(f"Confidence: {confidence:.4f} ({confidence*100:.2f}%)")
        print(f"Inference Time: {inference_time:.2f} ms")
        print(f"{'='*50}\n")

        # Show top 3 predictions
        print("Top 3 Predictions:")
        top5_indices = probs.top5
        top5_conf = probs.top5conf
        for i in range(min(3, len(top5_indices))):
            class_name = CLASS_NAMES[top5_indices[i]]
            conf = top5_conf[i].item()
            bar = "█" * int(conf * 20)
            print(f"   {class_name:10} {conf:.4f} {bar}")

    return predicted_class, confidence


def tflite_inference(model_path: str, image_path: str, verbose: bool = True) -> Tuple[str, float]:
    """
    Run inference using TFLite model (for mobile/edge deployment).

    Args:
        model_path: Path to .tflite model file
        image_path: Path to input image
        verbose: Print detailed results

    Returns:
        Tuple of (predicted_class, confidence)
    """
    if not TFLITE_AVAILABLE:
        raise ImportError("tensorflow and pillow packages required for TFLite inference")

    # Load TFLite model
    if verbose:
        print(f"🤖 Loading TFLite model: {model_path}")

    interpreter = tf.lite.Interpreter(model_path=model_path)
    interpreter.allocate_tensors()

    # Get input/output details
    input_details = interpreter.get_input_details()
    output_details = interpreter.get_output_details()

    input_shape = input_details[0]['shape']
    input_size = (input_shape[1], input_shape[2])  # (height, width)

    # Load and preprocess image
    if verbose:
        print(f"🔮 Running inference on: {image_path}")

    image = Image.open(image_path).convert('RGB')
    image = image.resize(input_size)

    # Normalize image (0-255 to 0-1)
    input_data = np.array(image, dtype=np.float32) / 255.0
    input_data = np.expand_dims(input_data, axis=0)  # Add batch dimension

    # Run inference
    start_time = time.time()
    interpreter.set_tensor(input_details[0]['index'], input_data)
    interpreter.invoke()
    output_data = interpreter.get_tensor(output_details[0]['index'])
    inference_time = (time.time() - start_time) * 1000  # Convert to ms

    # Process results
    probabilities = output_data[0]
    predicted_class_id = np.argmax(probabilities)
    predicted_class = CLASS_NAMES[predicted_class_id]
    confidence = probabilities[predicted_class_id]

    if verbose:
        print(f"\n{'='*50}")
        print(f"📊 RESULTS (TFLite)")
        print(f"{'='*50}")
        print(f"Predicted Class: {predicted_class}")
        print(f"Confidence: {confidence:.4f} ({confidence*100:.2f}%)")
        print(f"Inference Time: {inference_time:.2f} ms")
        print(f"{'='*50}\n")

        # Show top 3 predictions
        print("Top 3 Predictions:")
        top3_indices = np.argsort(probabilities)[-3:][::-1]
        for idx in top3_indices:
            class_name = CLASS_NAMES[idx]
            conf = probabilities[idx]
            bar = "█" * int(conf * 20)
            print(f"   {class_name:10} {conf:.4f} {bar}")

    return predicted_class, float(confidence)


def batch_inference(model_path: str, folder_path: str, use_tflite: bool = False):
    """
    Run inference on all images in a folder.

    Args:
        model_path: Path to model file
        folder_path: Path to folder containing images
        use_tflite: Use TFLite model instead of PyTorch
    """
    folder = Path(folder_path)
    image_extensions = {'.jpg', '.jpeg', '.png', '.bmp', '.tiff'}

    # Find all images
    images = [f for f in folder.iterdir()
             if f.suffix.lower() in image_extensions]

    if not images:
        print(f"❌ No images found in {folder_path}")
        return

    print(f"\n📁 Processing {len(images)} images from {folder_path}\n")

    # Select inference function
    inference_fn = tflite_inference if use_tflite else pytorch_inference

    # Process each image
    results = []
    for i, image_path in enumerate(images, 1):
        print(f"[{i}/{len(images)}] Processing: {image_path.name}")

        try:
            predicted_class, confidence = inference_fn(
                model_path, str(image_path), verbose=False
            )
            results.append({
                'image': image_path.name,
                'predicted': predicted_class,
                'confidence': confidence
            })
            print(f"   → {predicted_class} ({confidence:.4f})\n")
        except Exception as e:
            print(f"   ❌ Error: {e}\n")

    # Summary
    print(f"\n{'='*60}")
    print(f"BATCH INFERENCE SUMMARY")
    print(f"{'='*60}")
    print(f"Total images: {len(images)}")
    print(f"Successful: {len(results)}")

    # Class distribution
    from collections import Counter
    class_counts = Counter(r['predicted'] for r in results)
    print(f"\nPredicted Distribution:")
    for class_name, count in sorted(class_counts.items()):
        percentage = (count / len(results)) * 100
        print(f"   {class_name:10} {count:3} ({percentage:.1f}%)")

    # Average confidence
    avg_confidence = sum(r['confidence'] for r in results) / len(results)
    print(f"\nAverage Confidence: {avg_confidence:.4f}")
    print(f"{'='*60}\n")


def main():
    parser = argparse.ArgumentParser(
        description='Run inference on sugarcane leaf images'
    )
    parser.add_argument(
        '--model',
        type=str,
        required=True,
        help='Path to model file (.pt or .tflite)'
    )
    parser.add_argument(
        '--image',
        type=str,
        help='Path to input image'
    )
    parser.add_argument(
        '--folder',
        type=str,
        help='Path to folder containing images (batch inference)'
    )
    parser.add_argument(
        '--tflite',
        action='store_true',
        help='Use TFLite model (default: PyTorch)'
    )

    args = parser.parse_args()

    # Validate model path
    if not Path(args.model).exists():
        print(f"❌ Error: Model file not found: {args.model}")
        return

    # Validate inputs
    if not args.image and not args.folder:
        print("❌ Error: Either --image or --folder must be specified")
        return

    if args.image and args.folder:
        print("❌ Error: Specify either --image or --folder, not both")
        return

    # Run inference
    try:
        if args.image:
            # Single image inference
            if not Path(args.image).exists():
                print(f"❌ Error: Image file not found: {args.image}")
                return

            if args.tflite:
                tflite_inference(args.model, args.image)
            else:
                pytorch_inference(args.model, args.image)

        elif args.folder:
            # Batch inference
            if not Path(args.folder).exists():
                print(f"❌ Error: Folder not found: {args.folder}")
                return

            batch_inference(args.model, args.folder, args.tflite)

    except Exception as e:
        print(f"\n❌ Error during inference: {e}")
        import traceback
        traceback.print_exc()


if __name__ == '__main__':
    main()
