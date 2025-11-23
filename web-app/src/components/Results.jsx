import React from 'react';

export default function Results({ image, prediction, onNewImage }) {
  if (!prediction) return null;

  const { disease, confidencePercent, allPredictions, inferenceTime, info } = prediction;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Analysis Results</h2>
        <span style={styles.badge}>
          ⚡ {inferenceTime}ms
        </span>
      </div>

      {/* Image Preview */}
      <div style={styles.imageContainer}>
        <img src={image} alt="Analyzed leaf" style={styles.image} />
      </div>

      {/* Main Diagnosis */}
      <div style={{ ...styles.diagnosisCard, borderColor: info.color }}>
        <div style={styles.diagnosisHeader}>
          <span style={{ ...styles.icon, backgroundColor: info.color }}>
            {info.icon}
          </span>
          <div>
            <h3 style={styles.diseaseName}>{disease}</h3>
            <p style={styles.confidence}>
              Confidence: <strong>{confidencePercent}%</strong>
            </p>
          </div>
        </div>

        <div style={styles.diagnosisInfo}>
          <div style={styles.infoSection}>
            <h4 style={styles.infoTitle}>Description</h4>
            <p style={styles.infoText}>{info.description}</p>
          </div>

          <div style={styles.infoSection}>
            <h4 style={styles.infoTitle}>💊 Treatment</h4>
            <p style={styles.infoText}>{info.treatment}</p>
          </div>
        </div>
      </div>

      {/* All Predictions */}
      <div style={styles.allPredictions}>
        <h4 style={styles.predictionsTitle}>All Predictions:</h4>
        {allPredictions.map((pred, index) => (
          <div key={index} style={styles.predictionRow}>
            <div style={styles.predictionLeft}>
              <span style={{
                ...styles.predictionIcon,
                backgroundColor: pred.info.color
              }}>
                {pred.info.icon}
              </span>
              <span style={styles.predictionName}>{pred.disease}</span>
            </div>
            <div style={styles.predictionRight}>
              <div style={styles.progressBar}>
                <div
                  style={{
                    ...styles.progressFill,
                    width: `${pred.confidence * 100}%`,
                    backgroundColor: pred.info.color
                  }}
                />
              </div>
              <span style={styles.predictionPercent}>
                {(pred.confidence * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div style={styles.actions}>
        <button onClick={onNewImage} className="btn btn-primary" style={styles.fullWidthBtn}>
          🔄 Analyze Another Image
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
    maxWidth: '700px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: 'bold',
    color: '#1f2937',
  },
  badge: {
    background: '#e5e7eb',
    color: '#374151',
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    fontWeight: '600',
  },
  imageContainer: {
    marginBottom: '1.5rem',
    borderRadius: '1rem',
    overflow: 'hidden',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  image: {
    width: '100%',
    display: 'block',
  },
  diagnosisCard: {
    background: 'white',
    borderRadius: '1rem',
    padding: '1.5rem',
    marginBottom: '1.5rem',
    borderLeft: '4px solid',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
  },
  diagnosisHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  icon: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    color: 'white',
    flexShrink: 0,
  },
  diseaseName: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#1f2937',
    margin: 0,
  },
  confidence: {
    fontSize: '1rem',
    color: '#6b7280',
    margin: '0.25rem 0 0 0',
  },
  diagnosisInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  infoSection: {
    background: '#f9fafb',
    padding: '1rem',
    borderRadius: '0.5rem',
  },
  infoTitle: {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '0.5rem',
  },
  infoText: {
    fontSize: '0.9rem',
    color: '#6b7280',
    lineHeight: '1.5',
    margin: 0,
  },
  allPredictions: {
    background: 'white',
    borderRadius: '1rem',
    padding: '1.5rem',
    marginBottom: '1.5rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
  },
  predictionsTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '1rem',
  },
  predictionRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem 0',
    borderBottom: '1px solid #f3f4f6',
  },
  predictionLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    minWidth: '120px',
  },
  predictionIcon: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.875rem',
    color: 'white',
    flexShrink: 0,
  },
  predictionName: {
    fontSize: '0.9rem',
    fontWeight: '500',
    color: '#374151',
  },
  predictionRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    flex: 1,
    marginLeft: '1rem',
  },
  progressBar: {
    flex: 1,
    height: '8px',
    background: '#e5e7eb',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    transition: 'width 0.3s ease',
  },
  predictionPercent: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#6b7280',
    minWidth: '50px',
    textAlign: 'right',
  },
  actions: {
    display: 'flex',
    gap: '1rem',
  },
  fullWidthBtn: {
    width: '100%',
  },
};
