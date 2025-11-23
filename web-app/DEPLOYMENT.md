# 🚀 Deployment Guide

Complete guide to deploying your Sugarcane Disease Detector web app.

## Prerequisites

Before deploying:

1. ✅ **Model File**: Have `best.onnx` from Colab ready
2. ✅ **Node.js**: Installed (v18 or higher)
3. ✅ **Git**: Repository set up

## Step-by-Step Deployment

### Option 1: Vercel (Recommended) ⭐

**Why Vercel?**
- ✅ Free tier (generous limits)
- ✅ Automatic HTTPS
- ✅ CDN (fast worldwide)
- ✅ GitHub integration
- ✅ Zero configuration

**Steps:**

1. **Prepare your model**:
   ```bash
   # Copy your model to public folder
   cp ~/Downloads/sugarcane_models/best.onnx web-app/public/
   ```

2. **Install dependencies**:
   ```bash
   cd web-app
   npm install
   ```

3. **Test locally**:
   ```bash
   npm run dev
   # Open http://localhost:5173
   # Take a photo or upload an image to test
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

5. **Deploy to Vercel**:

   **Method A: Vercel CLI (Fastest)**
   ```bash
   npm install -g vercel
   vercel login
   vercel --prod
   ```

   **Method B: Vercel Dashboard**
   - Go to https://vercel.com
   - Click "New Project"
   - Import your GitHub repo
   - Set build command: `npm run build`
   - Set output directory: `dist`
   - Deploy!

6. **Your app is live!** 🎉
   - URL: `https://your-app.vercel.app`
   - Updates automatically on git push

**Custom Domain (Optional):**
- In Vercel dashboard → Settings → Domains
- Add your domain (e.g., sugarcane-detector.com)

---

### Option 2: Netlify

**Why Netlify?**
- ✅ Free tier
- ✅ Easy drag-and-drop
- ✅ Form handling
- ✅ Good for beginners

**Steps:**

1. **Build the app**:
   ```bash
   cd web-app
   npm install
   npm run build
   ```

2. **Deploy**:

   **Method A: Netlify CLI**
   ```bash
   npm install -g netlify-cli
   netlify login
   netlify deploy --prod --dir=dist
   ```

   **Method B: Drag & Drop**
   - Go to https://app.netlify.com/drop
   - Drag the `dist/` folder
   - Done!

3. **Your app is live!**
   - URL: `https://your-app.netlify.app`

---

### Option 3: GitHub Pages

**Why GitHub Pages?**
- ✅ Free forever
- ✅ Tied to your repo
- ✅ Simple

**Note**: Doesn't support server-side features, but our app is fully client-side so it works!

**Steps:**

1. **Update `vite.config.js`**:
   ```javascript
   export default defineConfig({
     base: '/scvision/',  // Your repo name
     // ... rest
   })
   ```

2. **Install gh-pages**:
   ```bash
   npm install -D gh-pages
   ```

3. **Add deploy script to `package.json`**:
   ```json
   "scripts": {
     "deploy": "npm run build && gh-pages -d dist"
   }
   ```

4. **Deploy**:
   ```bash
   npm run deploy
   ```

5. **Enable GitHub Pages**:
   - Go to GitHub repo → Settings → Pages
   - Source: Deploy from branch `gh-pages`
   - Save

6. **Your app is live!**
   - URL: `https://username.github.io/scvision/`

---

### Option 4: Self-Hosted (Advanced)

**For servers you control** (AWS, DigitalOcean, etc.)

1. **Build the app**:
   ```bash
   npm run build
   ```

2. **Upload `dist/` folder** to your server

3. **Configure web server** (nginx example):
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       root /path/to/dist;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

4. **Set up HTTPS** with Let's Encrypt:
   ```bash
   certbot --nginx -d your-domain.com
   ```

---

## Post-Deployment Checklist

After deploying, verify:

- [ ] App loads correctly
- [ ] Can upload/capture images
- [ ] Model loads (check browser console)
- [ ] Predictions work
- [ ] Works on mobile
- [ ] PWA features work (install prompt)
- [ ] HTTPS is enabled

## Optimizations

### Reduce Model Size

If `best.onnx` is too large (> 5MB):

```bash
# Quantize model (in Colab)
model.export(format='onnx', int8=True, simplify=True)
```

### Enable Caching

Models are cached automatically after first load (thanks to PWA service worker).

### Add Analytics (Optional)

Add to `index.html`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
```

## Monitoring

### Check Performance

Use browser DevTools:
- Network tab: Check model load time
- Performance tab: Check inference time
- Application tab: Check PWA/cache status

### Error Tracking (Optional)

Add Sentry for error tracking:
```bash
npm install @sentry/react
```

## Updating the App

### Method 1: Auto-deploy (Vercel/Netlify + GitHub)

Just push to GitHub:
```bash
git add .
git commit -m "Update disease info"
git push
# Deployment happens automatically!
```

### Method 2: Manual

```bash
npm run build
vercel --prod  # or netlify deploy --prod
```

## Troubleshooting

### Model not loading in production?

- Check `public/best.onnx` exists
- Check file size (< 100MB for most hosts)
- Check browser console for errors

### App works locally but not in production?

- Check base path in `vite.config.js`
- Ensure HTTPS is enabled
- Check CORS headers

### PWA not installing?

- Must be served over HTTPS
- Check manifest in DevTools → Application
- Ensure service worker registered

## Cost Estimates

| Platform | Free Tier | Paid Plans |
|----------|-----------|------------|
| Vercel | 100GB bandwidth | $20/month |
| Netlify | 100GB bandwidth | $19/month |
| GitHub Pages | Unlimited | Free forever |

**Recommendation**: Start with free tier, upgrade if needed.

## Security

### Best Practices

1. **HTTPS Only** - Always use HTTPS
2. **API Keys** - Don't commit secrets (if you add backend)
3. **Input Validation** - Already handled in code
4. **CSP Headers** - Add in hosting config

### Example Vercel Security Headers

Create `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        }
      ]
    }
  ]
}
```

## Next Steps

After successful deployment:

1. 📢 **Share** your app URL
2. 📊 **Monitor** usage and errors
3. 🔄 **Update** model as you collect more data
4. 💡 **Add features** based on feedback

## Need Help?

- Vercel Docs: https://vercel.com/docs
- Netlify Docs: https://docs.netlify.com
- GitHub Pages: https://pages.github.com

---

**Ready to deploy? Choose a platform above and follow the steps!** 🚀
