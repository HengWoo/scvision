# ⚡ Quick Start - Deploy in 5 Minutes

## Step 1: Get Your Model File (1 minute)

You need the `best.onnx` file from your Colab training.

### If you have the model zip:

```bash
# Extract and copy
unzip ~/Downloads/sugarcane_models.zip
cp best.onnx ~/scvision/web-app/public/
```

### If you only have best.pt:

Open your Colab notebook and run this in a new cell:

```python
from ultralytics import YOLO

# Load your trained model
model = YOLO('sugarcane_disease/yolov11n_cls/weights/best.pt')

# Export to ONNX format
model.export(format='onnx', imgsz=224, simplify=True)

print("✅ Model exported!")
print("📥 Download best.onnx from the Files panel")
```

Then download `best.onnx` and copy it to `web-app/public/`

## Step 2: Setup Project (2 minutes)

```bash
cd scvision/web-app

# Run setup script
./setup-model.sh

# Install dependencies
npm install
```

## Step 3: Test Locally (1 minute)

```bash
npm run dev
```

Open http://localhost:5173 and test with a sugarcane leaf image!

## Step 4: Deploy to Vercel (1 minute)

### Option A: Using Vercel CLI (Fastest)

```bash
# Build the app
npm run build

# Install Vercel CLI (one-time)
npm install -g vercel

# Login to Vercel (one-time)
vercel login

# Deploy!
vercel --prod
```

Follow the prompts:
- Link to existing project? **No**
- Project name? **sugarcane-detector** (or your choice)
- Directory? **(press Enter, uses current directory)**

**Done! 🎉** Your app is live!

### Option B: Using Vercel Dashboard

1. Go to https://vercel.com
2. Sign up/login (use GitHub)
3. Click "New Project"
4. Import your `scvision` repository
5. Configure:
   - **Framework**: Vite
   - **Root Directory**: `web-app`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Click "Deploy"

**Done! 🎉** Your app will be live at `https://your-project.vercel.app`

## 🎯 That's It!

You now have a live web app that:
- ✅ Runs your AI model in the browser
- ✅ Works on mobile and desktop
- ✅ Has 98.44% accuracy
- ✅ Works offline (PWA)
- ✅ Is free to host

## 🔄 Updating Your App

After deployment, updates are easy:

```bash
git add .
git commit -m "Update disease descriptions"
git push
```

Vercel auto-deploys on every push! 🚀

## ❓ Troubleshooting

### Model not loading?

```bash
# Check if model exists
ls -lh public/best.onnx

# Should show a file ~3-5 MB
```

### Build fails?

```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Need help?

Check the full guides:
- `README.md` - Complete setup guide
- `DEPLOYMENT.md` - Detailed deployment options

---

**Need help? Let me know!** 🌿
