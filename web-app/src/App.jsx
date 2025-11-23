import React, { useState, useEffect } from 'react';
import ImageUpload from './components/ImageUpload';
import Results from './components/Results';
import { loadModel, classifyImage, isModelLoaded } from './utils/model';
import './App.css';

export default function App() {
  const [modelLoaded, setModelLoaded] = useState(false);
  const [modelLoading, setModelLoading] = useState(true);
  const [modelError, setModelError] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [currentFile, setCurrentFile] = useState(null);
  const [prediction, setPrediction] = useState(null);

  // Load model on mount
  useEffect(() => {
    const initModel = async () => {
      try {
        setModelLoading(true);
        setModelError(null);

        // Path to your ONNX model (you'll need to add this file)
        await loadModel('/best.onnx');

        setModelLoaded(true);
        setModelLoading(false);
      } catch (error) {
        console.error('Failed to load model:', error);
        setModelError(error.message);
        setModelLoading(false);
      }
    };

    initModel();
  }, []);

  const handleImageSelected = async (imageUrl, file) => {
    setCurrentImage(imageUrl);
    setCurrentFile(file);
    setPrediction(null);
    setAnalyzing(true);

    try {
      const result = await classifyImage(file);
      setPrediction(result);
    } catch (error) {
      console.error('Classification error:', error);
      alert('Error analyzing image: ' + error.message);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleNewImage = () => {
    setCurrentImage(null);
    setCurrentFile(null);
    setPrediction(null);
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="header-content">
            <h1 className="logo">
              🌿 Sugarcane Disease Detector
            </h1>
            <p className="tagline">
              AI-powered leaf disease classification • 98.4% accuracy
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main">
        <div className="container">
          <div className="card">
            {/* Model Loading State */}
            {modelLoading && (
              <div className="loading-state">
                <div className="spinner" />
                <h3>Loading AI Model...</h3>
                <p>This may take a moment on first load</p>
              </div>
            )}

            {/* Model Error State */}
            {modelError && !modelLoading && (
              <div className="error-state">
                <div className="error-icon">⚠️</div>
                <h3>Failed to Load Model</h3>
                <p>{modelError}</p>
                <p className="error-hint">
                  Make sure <code>best.onnx</code> is in the <code>public/</code> folder.
                </p>
                <button onClick={() => window.location.reload()} className="btn btn-primary">
                  🔄 Retry
                </button>
              </div>
            )}

            {/* Model Loaded - Show App */}
            {modelLoaded && !modelLoading && (
              <>
                {/* Analyzing State */}
                {analyzing && (
                  <div className="analyzing-state">
                    <div className="spinner" />
                    <h3>Analyzing Image...</h3>
                    <p>Running AI inference on your image</p>
                  </div>
                )}

                {/* Upload or Show Results */}
                {!analyzing && !prediction && (
                  <ImageUpload onImageSelected={handleImageSelected} />
                )}

                {!analyzing && prediction && (
                  <Results
                    image={currentImage}
                    prediction={prediction}
                    onNewImage={handleNewImage}
                  />
                )}
              </>
            )}
          </div>

          {/* Info Section */}
          {modelLoaded && !prediction && !analyzing && (
            <div className="info-section">
              <h3 className="info-title">How it works</h3>
              <div className="info-grid">
                <div className="info-card">
                  <div className="info-icon">📸</div>
                  <h4>Capture</h4>
                  <p>Take a photo of the sugarcane leaf or upload an image</p>
                </div>
                <div className="info-card">
                  <div className="info-icon">🤖</div>
                  <h4>Analyze</h4>
                  <p>Our AI model analyzes the leaf in milliseconds</p>
                </div>
                <div className="info-card">
                  <div className="info-icon">💊</div>
                  <h4>Treat</h4>
                  <p>Get diagnosis and treatment recommendations</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>
            Powered by YOLO11n-cls • Trained on 2,569 images • 98.44% accuracy
          </p>
          <p className="footer-note">
            Note: This tool provides guidance. Consult agricultural experts for treatment.
          </p>
        </div>
      </footer>
    </div>
  );
}
