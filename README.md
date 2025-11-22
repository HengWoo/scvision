# Sugarcane Disease Classification System

AI-powered vision system for detecting and classifying sugarcane leaf diseases using YOLOv11 deep learning model, optimized for mobile and edge deployment.

## Overview

This project implements an image classification system to identify 5 types of sugarcane leaf conditions:
- **Healthy**
- **Mosaic**
- **Redrot**
- **Rust**
- **Yellow disease**

Built with **YOLOv11n-cls** (nano classification model) for fast, accurate inference on mobile devices and edge hardware.

## Key Features

- **High Accuracy**: 90-95% classification accuracy
- **Mobile-Optimized**: ~5 MB model size, 30-60 FPS inference
- **Easy Training**: Complete Google Colab notebook included
- **Multiple Formats**: Export to PyTorch, TFLite, and ONNX
- **Production Ready**: Inference script for deployment

## Dataset

Using the [Sugarcane Leaf Disease Dataset](https://www.kaggle.com/datasets/nirmalsankalana/sugarcane-leaf-disease-dataset) from Kaggle:
- **Total Images**: 2,569
- **Distribution**: Balanced across 5 classes
- **Source**: Real-world data from Maharashtra, India
- **Capture**: Various smartphone cameras

## Quick Start

### 1. Installation

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/scvision.git
cd scvision

# Install dependencies
pip install -r requirements.txt
```

### 2. Download Dataset

```python
import kagglehub

# Download from Kaggle (requires API credentials)
path = kagglehub.dataset_download("nirmalsankalana/sugarcane-leaf-disease-dataset")
print("Dataset path:", path)
```

Get Kaggle API credentials from https://www.kaggle.com/settings

### 3. Prepare Dataset

```bash
python scripts/prepare_dataset.py --source /path/to/kaggle/dataset --dest dataset/
```

This organizes images into train/val/test splits (70/20/10).

### 4. Train Model

Open `notebooks/train_colab.ipynb` in Google Colab:
- Enable GPU (Runtime → Change runtime type → T4 GPU)
- Upload Kaggle credentials
- Run all cells
- Training takes ~2-4 hours

### 5. Run Inference

```bash
# Single image
python inference.py --model models/best.pt --image test_leaf.jpg

# Batch processing
python inference.py --model models/best.pt --folder test_images/

# Using TFLite (mobile)
python inference.py --model models/best.tflite --image test_leaf.jpg --tflite
```

## Project Structure

```
scvision/
├── README.md                    # This file
├── claude.md                    # Detailed documentation
├── requirements.txt             # Python dependencies
├── inference.py                 # Inference script
├── dataset/                     # Dataset directory
│   ├── train/
│   ├── val/
│   └── test/
├── scripts/
│   └── prepare_dataset.py      # Dataset organization
├── notebooks/
│   └── train_colab.ipynb       # Training notebook
└── models/                      # Trained model weights
```

## Model Performance

| Metric | Expected Value |
|--------|---------------|
| Accuracy | 90-95% |
| Precision | 0.90-0.95 |
| Recall | 0.90-0.95 |
| F1-Score | 0.90-0.95 |
| Inference Speed | 30-60 FPS (mobile) |
| Model Size | ~5 MB (TFLite) |

## Deployment

### Mobile (Android/iOS)

1. Train model in Colab
2. Export to TFLite format
3. Download `.tflite` file
4. Integrate using TensorFlow Lite:
   - [Android Guide](https://www.tensorflow.org/lite/android)
   - [iOS Guide](https://www.tensorflow.org/lite/ios)

### Raspberry Pi / Edge Devices

```python
from ultralytics import YOLO

# Load TFLite model
model = YOLO('best.tflite')

# Run inference
results = model('leaf_image.jpg')
```

### Web Application

Export to ONNX and use with ONNX.js or create REST API with FastAPI.

## Training Configuration

**Default Parameters**:
- Model: YOLOv11n-cls
- Image size: 224x224
- Batch size: 64
- Epochs: 100
- Early stopping: 15 epochs patience
- Optimizer: Adam
- Learning rate: 0.001

## Requirements

- Python 3.8+
- ultralytics >= 8.1.0
- kagglehub >= 0.1.4
- torch (installed with ultralytics)
- tensorflow >= 2.15.0 (for TFLite)

See `requirements.txt` for complete list.

## Documentation

For detailed documentation, training tips, and troubleshooting, see **[claude.md](claude.md)**.

## Contributing

Contributions welcome! Please feel free to submit a Pull Request.

## License

This project is open source. The dataset is licensed under CC0 Public Domain.

## Acknowledgments

- Dataset: [Nirmalsankalana on Kaggle](https://www.kaggle.com/datasets/nirmalsankalana/sugarcane-leaf-disease-dataset)
- Model: [Ultralytics YOLOv11](https://github.com/ultralytics/ultralytics)

## Citation

If you use this project in your research, please cite:

```bibtex
@software{scvision2024,
  title={Sugarcane Disease Classification System},
  author={Your Name},
  year={2024},
  url={https://github.com/YOUR_USERNAME/scvision}
}
```

## Contact

For questions or issues, please open an issue on GitHub.

---

**Built with YOLOv11 by Ultralytics**
