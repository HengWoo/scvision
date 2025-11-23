# 🚀 Deploy Your App NOW - Step by Step

## Prerequisites Check

- [ ] You have `best.onnx` from Colab (or can get it)
- [ ] You have a GitHub account
- [ ] You're ready to deploy!

## 🎯 Fastest Path to Deployment (10 Minutes)

### Step 1: Get Your Model (Choose One)

#### Option A: You Already Have `best.onnx`

```bash
# If it's in Downloads:
cp ~/Downloads/best.onnx /home/user/scvision/web-app/public/best.onnx

# Or from the model zip:
unzip ~/Downloads/sugarcane_models.zip -d /tmp/
cp /tmp/sugarcane_disease/yolov11n_cls/weights/best.onnx /home/user/scvision/web-app/public/
```

#### Option B: You Only Have `best.pt` - Convert It

**In Google Colab, run this:**

```python
from ultralytics import YOLO

# Load your trained PyTorch model
model = YOLO('sugarcane_disease/yolov11n_cls/weights/best.pt')

# Export to ONNX format (optimized for web)
onnx_path = model.export(
    format='onnx',
    imgsz=224,
    simplify=True,  # Simplify for faster inference
    opset=12        # ONNX opset version
)

print(f"✅ Model exported to: {onnx_path}")
print("📥 Download this file from Files panel → Copy to web-app/public/")
```

Then:
1. Download `best.onnx` from Colab Files panel
2. Copy to `/home/user/scvision/web-app/public/best.onnx`

#### Option C: Don't Have Model - Use Placeholder

For testing deployment without the model:

```bash
# Create a dummy file (app will load but not work)
touch /home/user/scvision/web-app/public/best.onnx
echo "Note: Add real model later for actual predictions"
```

### Step 2: Verify Setup

```bash
cd /home/user/scvision/web-app

# Run the setup checker
./setup-model.sh

# Should see: ✅ Model found: public/best.onnx
```

### Step 3: Install Dependencies

```bash
npm install
```

### Step 4: Test Locally (Optional but Recommended)

```bash
npm run dev
```

Visit http://localhost:5173 and test with a leaf image!

### Step 5: Build for Production

```bash
npm run build
```

Should see:
```
✓ built in XXXms
✓ dist/ ready to deploy
```

### Step 6: Deploy to Vercel

#### Method A: Vercel CLI (Recommended)

```bash
# Install Vercel CLI (one-time)
npm install -g vercel

# Login (opens browser for authentication)
vercel login

# Deploy!
cd /home/user/scvision/web-app
vercel --prod
```

**Follow prompts:**
```
? Set up and deploy "web-app"? [Y/n] Y
? Which scope? [Your account name]
? Link to existing project? [N]
? What's your project's name? sugarcane-detector
? In which directory is your code located? ./
```

**Done!** 🎉 You'll get a URL like:
```
✅ Production: https://sugarcane-detector.vercel.app
```

#### Method B: Vercel Dashboard (Alternative)

1. **Push to GitHub first:**
   ```bash
   git add web-app/public/best.onnx
   git commit -m "Add trained ONNX model"
   git push origin claude/setup-colab-training-01CkBAV9jf3V4Ek2VcyVuzDC
   ```

2. **Go to Vercel:**
   - Visit https://vercel.com/new
   - Click "Import Git Repository"
   - Select your `scvision` repository
   - Configure:
     - **Root Directory**: `web-app`
     - **Framework Preset**: Vite
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
   - Click "Deploy"

3. **Wait ~2 minutes** for build to complete

4. **Your app is live!** Visit the URL provided

## 🎊 Post-Deployment

### Test Your Live App

1. Visit your Vercel URL
2. Try "Use Camera" or "Upload Image"
3. Test with a sugarcane leaf photo
4. Verify diagnosis appears correctly

### Share Your App

```
🌿 Sugarcane Disease Detector
📱 https://your-app.vercel.app

- AI-powered disease detection
- 98.44% accuracy
- Works on mobile & desktop
- Free to use!
```

### Custom Domain (Optional)

In Vercel Dashboard:
1. Go to your project → Settings → Domains
2. Add domain (e.g., `sugarcane-detector.com`)
3. Update DNS records as instructed
4. Done! Your app is at your custom domain

## 🔄 Future Updates

**Auto-deployment is enabled!** Every time you push to GitHub:

```bash
# Make changes to the app
cd /home/user/scvision/web-app/src
# ... edit files ...

# Commit and push
git add .
git commit -m "Updated disease descriptions"
git push

# Vercel automatically rebuilds and deploys! 🚀
```

## 🐛 Troubleshooting

### Model file too large for git?

Add to `.gitignore`:
```bash
echo "web-app/public/*.onnx" >> .gitignore
```

Then upload model directly to Vercel:
```bash
# Deploy with model using CLI
vercel --prod
# Model is included in deployment even if not in git
```

### Build fails?

```bash
# Clear cache
rm -rf node_modules dist .vite
npm install
npm run build
```

### App loads but model doesn't work?

1. Check browser console (F12)
2. Verify model file exists: `ls -lh web-app/public/best.onnx`
3. Ensure file is ~3-5 MB (not 0 bytes)

## 📊 Deployment Checklist

Before deploying, ensure:

- [ ] `best.onnx` is in `web-app/public/` folder
- [ ] Model file is 3-5 MB (not empty)
- [ ] `npm install` completed successfully
- [ ] `npm run build` works without errors
- [ ] Local test worked (`npm run dev`)
- [ ] You have a Vercel account (free)

## 🎯 Quick Commands Summary

```bash
# 1. Add model
cp ~/Downloads/best.onnx web-app/public/

# 2. Setup
cd web-app
npm install

# 3. Test locally
npm run dev

# 4. Build
npm run build

# 5. Deploy
vercel --prod
```

---

**Ready to deploy? Start with Step 1 above!** 🚀

Questions? Check:
- `web-app/README.md` - Full setup guide
- `web-app/DEPLOYMENT.md` - Detailed deployment options
- `web-app/QUICKSTART.md` - 5-minute guide
