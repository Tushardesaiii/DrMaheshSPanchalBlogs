# Deployment Guide

This guide covers deploying both the frontend and backend of the MaheshSir Knowledge Platform.

## 🚀 Frontend Deployment

### Prerequisites
- Node.js 18+ installed
- Build the project: `npm run build`

### Configuration Files

The following files handle SPA routing in production:

#### ✅ Vercel ([vercel.json](vercel.json))
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

#### ✅ Netlify ([netlify.toml](netlify.toml))
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### ✅ Apache ([public/.htaccess](public/.htaccess))
For traditional web servers using Apache.

#### ✅ Nginx
Add this to your nginx config:
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

### Environment Variables

Create a `.env` file (copy from [.env.example](.env.example)):

```bash
# Production backend URL
VITE_API_BASE_URL=https://your-backend-api.com
```

**Important:** 
- For local development, leave `VITE_API_BASE_URL` empty (uses Vite proxy)
- For production, set it to your deployed backend URL

### Platform-Specific Instructions

#### Vercel
1. Push your code to GitHub
2. Import project in Vercel
3. Set environment variable: `VITE_API_BASE_URL`
4. Deploy ✅

#### Netlify
1. Push your code to GitHub
2. Import project in Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Set environment variable: `VITE_API_BASE_URL`
6. Deploy ✅

#### Traditional Hosting (cPanel, etc.)
1. Run `npm run build`
2. Upload contents of `dist/` folder to your web root
3. Ensure `.htaccess` is uploaded
4. Set `VITE_API_BASE_URL` before building

---

## 🔧 Backend Deployment

### Prerequisites
- MongoDB database (MongoDB Atlas recommended)
- Cloudinary account for file uploads
- Node.js 18+ installed

### Environment Variables

Create `.env` file in Backend folder:

```bash
# Server
PORT=8000
NODE_ENV=production

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname

# Authentication
ACCESS_TOKEN_SECRET=your-super-secret-jwt-key-here
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your-refresh-token-secret-here
REFRESH_TOKEN_EXPIRY=10d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# CORS - Frontend URLs (comma-separated)
CORS_ORIGIN=https://your-frontend.vercel.app,https://www.yourdomain.com
```

### Platform-Specific Instructions

#### Render / Railway / Heroku
1. Push code to GitHub
2. Connect repository
3. Set all environment variables
4. Deploy ✅

#### VPS (Ubuntu/DigitalOcean/AWS)
1. SSH into your server
2. Install Node.js and PM2:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   sudo npm install -g pm2
   ```
3. Clone your repository
4. Install dependencies: `npm install`
5. Create `.env` file with production values
6. Start with PM2:
   ```bash
   pm2 start src/index.js --name maheshsir-backend
   pm2 save
   pm2 startup
   ```
7. Setup Nginx reverse proxy (optional but recommended)

---

## ✅ Deployment Checklist

### Frontend
- [ ] Build passes: `npm run build`
- [ ] Set `VITE_API_BASE_URL` environment variable
- [ ] Platform config file present (vercel.json / netlify.toml / .htaccess)
- [ ] Test all routes after deployment (especially `/admin`)

### Backend
- [ ] All environment variables set
- [ ] MongoDB connection string valid
- [ ] Cloudinary credentials configured
- [ ] CORS origins include frontend URL
- [ ] Test API endpoints: `/api/auth/login`, `/api/content`

### After Deployment
- [ ] Frontend loads correctly
- [ ] Can navigate to `/admin` without 404
- [ ] Can login to admin panel
- [ ] Admin dashboard loads
- [ ] Can create/edit/delete content
- [ ] Images upload successfully

---

## 🐛 Common Issues

### "404 on /admin route"
- ✅ Fixed: SPA routing configs added
- Ensure `.htaccess` / `vercel.json` / `netlify.toml` is present

### "API calls failing"
- Check `VITE_API_BASE_URL` is set correctly
- Check backend CORS includes your frontend URL
- Check browser console for actual error

### "Images not uploading"
- Verify Cloudinary environment variables
- Check backend logs for upload errors
- Ensure file size limits aren't exceeded

---

## 📝 Notes

- The frontend uses **Vite proxy** in development (`/api` → `http://localhost:8000`)
- In production, set `VITE_API_BASE_URL` to direct API calls to your backend
- All admin routes require authentication (JWT token)
- Files are stored in Cloudinary, not on the server

For questions, check the logs or browser console for more details.
