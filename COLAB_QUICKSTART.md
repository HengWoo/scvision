# Google Colab Training - Quick Start Guide

## 🚀 Quick Start (5 minutes)

### Step 1: Get Your Kaggle API Credentials

1. Go to https://www.kaggle.com/settings
2. Scroll down to "API" section
3. Click "Create New API Token"
4. A `kaggle.json` file will download
5. Open it - you'll see your `username` and `key`

Example `kaggle.json`:
```json
{
  "username": "your_username",
  "key": "abc123def456..."
}
```

### Step 2: Open the Colab Notebook

1. Go to Google Colab: https://colab.research.google.com/
2. Click **File → Upload notebook**
3. Upload `notebooks/train_colab.ipynb` from this repository

**OR** use this direct link (if repo is public):
```
https://colab.research.google.com/github/YOUR_USERNAME/scvision/blob/main/notebooks/train_colab.ipynb
```

### Step 3: Enable GPU

1. In Colab, click **Runtime → Change runtime type**
2. Select **T4 GPU** (free tier)
3. Click **Save**

### Step 4: Setup Kaggle Credentials in Colab

In the notebook, find the cell that says:
```python
KAGGLE_USERNAME = "your_username"
KAGGLE_KEY = "your_api_key"
```

Replace with your actual credentials from Step 1:
```python
KAGGLE_USERNAME = "your_username"      # From kaggle.json
KAGGLE_KEY = "abc123def456..."         # From kaggle.json
```

### Step 5: Run All Cells

1. Click **Runtime → Run all**
2. Wait 2-4 hours for training to complete
3. Download your trained models from the generated zip file

## 📊 What Happens During Training

1. **Setup** (2 min): Installs required packages
2. **Download Dataset** (5 min): Downloads 2,569 sugarcane images from Kaggle
3. **Prepare Data** (2 min): Organizes images into train/val/test splits
4. **Training** (2-4 hours): Trains YOLOv11n-cls model
5. **Validation** (2 min): Tests model accuracy
6. **Export** (5 min): Converts to TFLite and ONNX formats

## 📦 Download Your Trained Models

At the end of training, the notebook creates `sugarcane_models.zip` containing:
- `best.pt` - PyTorch model (use for Python applications)
- `best_saved_model/` - TFLite model (use for mobile apps)
- `best.onnx` - ONNX model (use for web/cross-platform)

Download from Colab's **Files panel** (left sidebar).

## 🎯 Expected Results

- **Training Time**: 2-4 hours on T4 GPU
- **Accuracy**: 90-95% on test set
- **Model Size**: ~5 MB (TFLite)
- **Inference Speed**: 30-60 FPS on mobile

## 🔧 Troubleshooting

### "Permission denied" when downloading dataset
- Make sure your Kaggle credentials are correct
- Verify you've accepted the dataset terms at: https://www.kaggle.com/datasets/nirmalsankalana/sugarcane-leaf-disease-dataset

### "Out of memory" error
- Reduce batch size in training cell: `batch=32` instead of `batch=64`
- Use T4 GPU (not CPU)

### Colab disconnects during training
- Colab free tier limits: 12 hours max session
- Keep browser tab open
- Consider Colab Pro for longer sessions

### Low accuracy (<80%)
- Train for more epochs: `epochs=150`
- Check data quality in visualization step
- Ensure dataset downloaded completely

## 💡 Tips for Better Results

1. **Monitor Training**: Watch the training curves in Step 6
2. **Early Stopping**: Training will stop automatically if no improvement for 15 epochs
3. **Data Augmentation**: Already enabled by default
4. **Save Checkpoints**: Models are saved every epoch automatically

## 📱 Next Steps After Training

1. **Test Locally**: Use `inference.py` to test on new images
2. **Mobile Integration**: Use the TFLite model in your Android/iOS app
3. **Collect More Data**: Improve accuracy by adding more images
4. **Fine-tune**: Retrain with your own field data

## 🆘 Need Help?

- Check the main README.md for detailed documentation
- See claude.md for in-depth explanations
- Open an issue on GitHub

---

**Ready to train?** Open the notebook and follow Step 4 above! 🚀
