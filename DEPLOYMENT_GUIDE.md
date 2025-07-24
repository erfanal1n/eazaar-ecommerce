# 🚀 EAZAAR E-commerce Deployment Guide

## Overview
This guide will help you deploy your EAZAAR e-commerce project (3 components) to free hosting platforms.

## 🔒 Security Notice
**IMPORTANT**: All sensitive credentials have been moved to `.env.example` files. You'll need to configure environment variables in your deployment platforms.

## 📋 Deployment Strategy

### 1. Backend → Vercel (Free)
### 2. Frontend → Vercel (Free) 
### 3. Admin Panel → Netlify (Free)

---

## 🖥️ **Backend Deployment (Vercel)**

### Step 1: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) → Sign up with GitHub
2. **New Project** → Import your repository
3. **Root Directory**: Set to `eazaar-backend`
4. Click **Deploy**

### Step 2: Environment Variables
In Vercel Dashboard → Settings → Environment Variables, add:

**⚠️ IMPORTANT: Use the actual values from your `CREDENTIALS.txt` file (not committed to GitHub)**

```env
PORT=7000
NODE_ENV=production
MONGO_URI=your_mongodb_connection_string
TOKEN_SECRET=your_token_secret_here
JWT_SECRET_FOR_VERIFY=your_jwt_secret_for_verify_here
SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
HOST=smtp.gmail.com
EMAIL_PORT=465
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLOUDINARY_UPLOAD_PRESET=your_upload_preset
STRIPE_KEY=sk_test_your_stripe_secret_key
STORE_URL=https://your-frontend-domain.vercel.app
ADMIN_URL=https://your-admin-domain.netlify.app
```

### Step 3: Get Backend URL
After deployment, copy your backend URL (e.g., `https://eazaar-backend-xyz.vercel.app`)

---

## 🌐 **Frontend Deployment (Vercel)**

### Step 1: Deploy Frontend
1. **New Vercel Project** → Import same repository
2. **Root Directory**: Set to `eazaar-front-end`
3. Click **Deploy**

### Step 2: Environment Variables
```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_STRIPE_KEY=pk_test_your_stripe_public_key
NEXT_PUBLIC_API_BASE_URL=https://your-backend-url.vercel.app/api
NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app/api
```

**Replace `your-backend-url.vercel.app` with your actual backend URL from Step 1**

---

## 👨‍💼 **Admin Panel Deployment (Netlify)**

### Step 1: Deploy to Netlify
1. Go to [netlify.com](https://netlify.com) → Sign up with GitHub
2. **New site from Git** → Select your repository
3. **Build settings**:
   - Build command: `cd eazaar-admin-panel && npm run build`
   - Publish directory: `eazaar-admin-panel/.next`

### Step 2: Environment Variables
In Netlify → Site settings → Environment variables:
```env
NEXT_PUBLIC_API_BASE_URL=https://your-backend-url.vercel.app/api
NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app/api
```

---

## 🔄 **Final Configuration**

### Update Backend URLs
Go back to **Vercel backend** environment variables and update:
```env
STORE_URL=https://your-frontend-url.vercel.app
ADMIN_URL=https://your-admin-url.netlify.app
```

---

## ✅ **Testing Checklist**

- [ ] Backend API endpoints respond correctly
- [ ] Frontend loads and can fetch products
- [ ] Admin panel loads and can manage data
- [ ] User registration/login works
- [ ] Add to cart functionality works
- [ ] Image uploads work (Cloudinary)
- [ ] Email notifications work

---

## 🛠️ **Useful Commands**

### Test Backend Locally
```bash
cd eazaar-backend
npm install
npm start
```

### Test Frontend Locally
```bash
cd eazaar-front-end
npm install
npm run dev
```

### Test Admin Panel Locally
```bash
cd eazaar-admin-panel
npm install
npm run dev
```

---

## 🆘 **Troubleshooting**

### Common Issues:

1. **CORS Errors**: Ensure backend allows your frontend domains
2. **API Not Found**: Check environment variable URLs
3. **Build Failures**: Verify Node.js version compatibility
4. **Database Connection**: Ensure MongoDB Atlas allows all IPs (0.0.0.0/0)

### Support:
- Check deployment logs in platform dashboards
- Verify environment variables are set correctly
- Test API endpoints with tools like Postman

---

## 💡 **Free Tier Limits**

### Vercel Free:
- 100GB bandwidth/month
- Unlimited static sites
- Serverless functions included

### Netlify Free:
- 100GB bandwidth/month
- 300 build minutes/month

### MongoDB Atlas Free:
- 512MB storage
- Shared cluster

**Total Monthly Cost: $0** 🎉

---

**🚀 Your EAZAAR E-commerce website is ready to go live!**