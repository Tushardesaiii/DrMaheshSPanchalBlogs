# 🔗 Connecting Frontend (Vercel) with Backend (Render)

This guide shows you exactly how to connect your deployed apps.

---

## 📍 Step 1: Get Your Deployment URLs

### Backend (Render)
After deploying on Render, you'll get a URL like:
```
https://maheshsir-blog-backend.onrender.com
```
**Copy this URL - you'll need it!**

### Frontend (Vercel)
After deploying on Vercel, you'll get a URL like:
```
https://maheshsir-blog.vercel.app
```
**Copy this URL too!**

---

## 🔧 Step 2: Configure Backend (Render)

Go to your Render dashboard → Your service → Environment

### Add/Update these Environment Variables:

```bash
# Your frontend URL - THIS IS CRITICAL!
CORS_ORIGIN=https://maheshsir-blog.vercel.app

# If you have multiple domains (add more with commas):
# CORS_ORIGIN=https://maheshsir-blog.vercel.app,https://www.yourdomain.com

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname

# JWT Secrets (generate random strings)
ACCESS_TOKEN_SECRET=your-secret-key-here-min-32-characters
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your-refresh-secret-here-min-32-characters  
REFRESH_TOKEN_EXPIRY=10d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Server
PORT=8000
NODE_ENV=production
```

**Important:** After adding environment variables, Render will automatically redeploy your app.

---

## 🎨 Step 3: Configure Frontend (Vercel)

Go to Vercel dashboard → Your project → Settings → Environment Variables

### Add this Environment Variable:

```bash
# Name
VITE_API_BASE_URL

# Value (your Render backend URL)
https://maheshsir-blog-backend.onrender.com
```

**Important:** 
- Do NOT include `/api` at the end
- After adding, you must **redeploy** your frontend:
  - Go to Deployments tab
  - Click the three dots on latest deployment
  - Click "Redeploy"

---

## ✅ Step 4: Verify Connection

### Test Backend API:
Open in browser: `https://your-backend.onrender.com/api/content`

Should return JSON with your content (or empty array if no content yet).

### Test Frontend:
1. Open your Vercel URL: `https://your-app.vercel.app`
2. Open browser console (F12)
3. Check for API calls - should show requests to your Render backend
4. Try logging into admin: `https://your-app.vercel.app/login`

---

## 🐛 Troubleshooting

### Error: "CORS policy blocked"
**Solution:** Check that `CORS_ORIGIN` in Render includes your exact Vercel URL
- ✅ Correct: `https://maheshsir-blog.vercel.app`
- ❌ Wrong: `https://maheshsir-blog.vercel.app/` (no trailing slash)
- ❌ Wrong: `http://maheshsir-blog.vercel.app` (must be https)

### Error: "Failed to fetch" or "Network error"
**Solution:** Check that `VITE_API_BASE_URL` in Vercel is set correctly
- ✅ Correct: `https://your-backend.onrender.com`
- ❌ Wrong: `https://your-backend.onrender.com/api` (no /api)
- **Remember to redeploy after changing env vars!**

### Error: "Cannot read properties of undefined"
**Solution:** Check Backend is running
- Go to Render dashboard
- Check if backend service is active
- Check logs for errors

### Render Free Tier: Backend "spins down"
Render's free tier puts inactive services to sleep after 15 minutes.
- First request after sleep takes 30-60 seconds
- Consider:
  - Upgrading to paid tier ($7/month)
  - Using a "keep-alive" service (Google it)
  - Accepting the delay

---

## 📋 Quick Checklist

### Backend (Render):
- [ ] `CORS_ORIGIN` includes frontend URL
- [ ] `MONGODB_URI` is set
- [ ] All JWT secrets are set
- [ ] Cloudinary credentials are set
- [ ] Service is running (check dashboard)

### Frontend (Vercel):  
- [ ] `VITE_API_BASE_URL` points to backend
- [ ] Redeployed after adding env var
- [ ] Can access all routes including `/admin`
- [ ] No CORS errors in console

### Testing:
- [ ] Backend URL works: `https://backend.onrender.com/api/content`
- [ ] Frontend loads: `https://app.vercel.app`
- [ ] Can login to admin panel
- [ ] API calls work (check Network tab)

---

## 🎯 Example Configuration

**Render Environment Variables:**
```
CORS_ORIGIN=https://maheshsir-knowledge.vercel.app
MONGODB_URI=mongodb+srv://admin:pass123@cluster0.xxx.mongodb.net/blog
ACCESS_TOKEN_SECRET=super-secret-key-minimum-32-characters-long
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=another-secret-key-minimum-32-chars-long
REFRESH_TOKEN_EXPIRY=10d
CLOUDINARY_CLOUD_NAME=mycloud
CLOUDINARY_API_KEY=123456789
CLOUDINARY_API_SECRET=abcdef123456
PORT=8000
NODE_ENV=production
```

**Vercel Environment Variable:**
```
VITE_API_BASE_URL=https://maheshsir-blog-api.onrender.com
```

---

## 🚀 After Setup

Once everything is configured:
1. Frontend will make API calls to backend
2. CORS will allow the requests
3. Authentication will work across domains
4. File uploads will go to Cloudinary
5. Everything should work like in development!

**Need help?** Check:
- Render logs (Dashboard → Service → Logs)
- Vercel logs (Dashboard → Project → Deployments → View Function Logs)
- Browser console (F12 → Console & Network tabs)
