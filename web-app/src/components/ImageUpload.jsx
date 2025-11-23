import React, { useRef, useState } from 'react';

export default function ImageUpload({ onImageSelected }) {
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const [useCamera, setUseCamera] = useState(false);
  const [stream, setStream] = useState(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onImageSelected(event.target.result, file);
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setUseCamera(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Could not access camera. Please upload an image instead.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setUseCamera(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0);

      canvas.toBlob((blob) => {
        const file = new File([blob], 'camera-photo.jpg', { type: 'image/jpeg' });
        const url = URL.createObjectURL(blob);
        onImageSelected(url, file);
        stopCamera();
      }, 'image/jpeg', 0.95);
    }
  };

  return (
    <div style={styles.container}>
      {!useCamera ? (
        <div style={styles.uploadSection}>
          <h2 style={styles.title}>Upload Sugarcane Leaf Image</h2>
          <p style={styles.subtitle}>Take a photo or upload an existing image</p>

          <div style={styles.buttonGroup}>
            <button onClick={startCamera} className="btn btn-primary" style={styles.fullWidthBtn}>
              📸 Use Camera
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="btn btn-secondary"
              style={styles.fullWidthBtn}
            >
              📁 Upload Image
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />

          <div style={styles.info}>
            <p style={styles.infoText}>
              <strong>Tips for best results:</strong>
            </p>
            <ul style={styles.tipsList}>
              <li>Use good lighting</li>
              <li>Capture the entire leaf</li>
              <li>Avoid shadows and blur</li>
              <li>Focus on diseased areas if visible</li>
            </ul>
          </div>
        </div>
      ) : (
        <div style={styles.cameraSection}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            style={styles.video}
          />

          <div style={styles.cameraControls}>
            <button onClick={capturePhoto} className="btn btn-primary">
              📸 Capture Photo
            </button>
            <button onClick={stopCamera} className="btn btn-secondary">
              ✕ Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
    maxWidth: '600px',
    margin: '0 auto',
  },
  uploadSection: {
    textAlign: 'center',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '0.5rem',
  },
  subtitle: {
    fontSize: '1rem',
    color: '#6b7280',
    marginBottom: '2rem',
  },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginBottom: '2rem',
  },
  fullWidthBtn: {
    width: '100%',
  },
  info: {
    background: '#f3f4f6',
    borderRadius: '0.5rem',
    padding: '1.5rem',
    textAlign: 'left',
  },
  infoText: {
    fontSize: '0.95rem',
    color: '#374151',
    marginBottom: '0.75rem',
  },
  tipsList: {
    fontSize: '0.9rem',
    color: '#6b7280',
    paddingLeft: '1.5rem',
    margin: 0,
  },
  cameraSection: {
    position: 'relative',
  },
  video: {
    width: '100%',
    borderRadius: '1rem',
    marginBottom: '1rem',
  },
  cameraControls: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
  },
};
