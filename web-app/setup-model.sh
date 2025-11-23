#!/bin/bash
# Setup script for adding the ONNX model

echo "🌿 Sugarcane Disease Detector - Model Setup"
echo "============================================"
echo ""

# Check if best.onnx exists in public/
if [ -f "public/best.onnx" ]; then
    echo "✅ Model found: public/best.onnx"
    SIZE=$(du -h public/best.onnx | cut -f1)
    echo "   Size: $SIZE"
    echo ""
    echo "✅ Ready to deploy!"
else
    echo "❌ Model not found: public/best.onnx"
    echo ""
    echo "📥 Please add your model file:"
    echo ""
    echo "Option 1: Copy from downloads"
    echo "  cp ~/Downloads/best.onnx public/best.onnx"
    echo ""
    echo "Option 2: Copy from extracted model zip"
    echo "  cp ~/Downloads/sugarcane_models/best.onnx public/best.onnx"
    echo ""
    echo "Option 3: If you only have best.pt, convert it:"
    echo "  1. Open Google Colab"
    echo "  2. Run:"
    echo "     from ultralytics import YOLO"
    echo "     model = YOLO('best.pt')"
    echo "     model.export(format='onnx', imgsz=224, simplify=True)"
    echo "  3. Download best.onnx"
    echo "  4. Copy to public/ folder"
    echo ""
    exit 1
fi

echo "🔍 Testing model file..."
if file public/best.onnx | grep -q "data"; then
    echo "✅ Model file appears valid"
else
    echo "⚠️  Warning: Model file may be corrupted"
fi

echo ""
echo "✅ Setup complete! Next steps:"
echo "   1. npm install"
echo "   2. npm run dev (test locally)"
echo "   3. npm run build && vercel --prod (deploy)"
echo ""
