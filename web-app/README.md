# 🌿 Sugarcane Disease Detector - Web App

Progressive Web App for detecting sugarcane leaf diseases using AI.

## Features

- 📸 **Camera Integration** - Take photos directly in the browser
- 📁 **Image Upload** - Upload existing images
- 🤖 **AI-Powered** - 98.44% accuracy using YOLO11n-cls
- ⚡ **Fast Inference** - Results in ~10-20ms
- 📱 **PWA** - Install on mobile devices, works offline after first load
- 🎨 **Modern UI** - Clean, responsive design

## Quick Start

### 1. Install Dependencies

```bash
cd web-app
npm install
```

### 2. Add Your Model

Copy the ONNX model from your Colab training:

```bash
# Copy best.onnx from your Colab download to web-app/public/
cp ~/Downloads/best.onnx public/best.onnx
```

**Important**: The model file must be named `best.onnx` and placed in the `public/` folder.

### 3. Run Development Server

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

### 4. Build for Production

```bash
npm run build
```

The production files will be in the `dist/` folder.

## Deployment

### Deploy to Vercel (Recommended - Free)

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy**:
   ```bash
   npm run build
   vercel dist/
   ```

3. **Follow prompts** - Link to your GitHub, set project name

4. **Done!** You'll get a URL like: `https://your-app.vercel.app`

### Deploy to Netlify (Alternative - Free)

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Deploy**:
   ```bash
   npm run build
   netlify deploy --prod --dir=dist
   ```

3. **Follow prompts** - Authenticate, set site name

### Deploy to GitHub Pages

1. **Update `vite.config.js`** - Add base path:
   ```javascript
   export default defineConfig({
     base: '/your-repo-name/',
     // ... rest of config
   })
   ```

2. **Build and deploy**:
   ```bash
   npm run build
   # Then push dist/ folder to gh-pages branch
   ```

## Project Structure

```
web-app/
├── public/
│   └── best.onnx          # Your trained model (ADD THIS!)
├── src/
│   ├── components/
│   │   ├── ImageUpload.jsx  # Camera/upload component
│   │   └── Results.jsx      # Results display
│   ├── utils/
│   │   └── model.js         # ONNX inference logic
│   ├── App.jsx              # Main app component
│   ├── App.css              # App styles
│   ├── index.css            # Global styles
│   └── main.jsx             # App entry point
├── index.html             # HTML template
├── package.json           # Dependencies
├── vite.config.js         # Vite configuration
└── README.md             # This file
```

## Technologies Used

- **React 18** - UI framework
- **Vite 5** - Build tool (fast, modern)
- **ONNX Runtime Web** - Run model in browser
- **Vite PWA Plugin** - Progressive Web App features

## Model Requirements

The app expects an ONNX model with:
- **Input**: `images` tensor, shape `[1, 3, 224, 224]`, float32
- **Output**: Classification logits for 5 classes
- **Classes**: Healthy, Mosaic, Redrot, Rust, Yellow (in this order)

## Browser Compatibility

- ✅ Chrome/Edge (recommended)
- ✅ Safari (iOS 13.4+)
- ✅ Firefox
- ✅ Opera

**Note**: Camera features require HTTPS (works on localhost for development).

## Performance

- **Model Size**: ~3 MB (ONNX)
- **Load Time**: ~1-2 seconds (first load)
- **Inference Time**: 10-20ms per image
- **Offline**: Works after first load (PWA)

## Troubleshooting

### Model not loading?

Make sure `best.onnx` is in the `public/` folder:
```bash
ls -lh public/best.onnx
```

### Camera not working?

- Ensure you're using HTTPS (or localhost)
- Grant camera permissions when prompted
- Try uploading an image instead

### Build errors?

Clear cache and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

## Development

### Adding New Features

1. **Edit components** in `src/components/`
2. **Update model logic** in `src/utils/model.js`
3. **Test** with `npm run dev`
4. **Build** with `npm run build`

### Customization

- **Colors**: Edit CSS in `src/App.css` and `src/index.css`
- **Disease Info**: Update `DISEASE_INFO` in `src/utils/model.js`
- **UI Text**: Edit components in `src/components/`

## License

Open source - same as parent project.

## Support

For issues or questions, open an issue on GitHub.

---

**Built with React + ONNX Runtime** • Powered by YOLO11n-cls
