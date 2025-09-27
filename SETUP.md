# MS Photo Studio - Setup Guide

## 🚀 Quick Start

### 1. Environment Setup
Copy `env.local.example` to `.env.local` and fill in your values:

```bash
cp env.local.example .env.local
```

### 2. Required Environment Variables

**For Development:**
```env
# Database
MONGODB_URI=mongodb://localhost:27017/ms-photo-studio

# JWT Authentication  
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=1h

# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi

# Cloudinary (Optional for testing)
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

**Default Admin Credentials:**
- Username: `admin`
- Password: `password123`

### 3. Start Development Server
```bash
npm run dev
```

### 4. Test the Application
- Visit: `http://localhost:5173`
- Admin Login: `http://localhost:5173/admin`
- Diagnostics: `http://localhost:5173/diagnostics`

## 🔧 Troubleshooting

### Login Stuck on "Logging in..."
1. Check if `.env.local` exists with proper values
2. Verify MongoDB is running (if using local MongoDB)
3. Check browser console for errors
4. Visit `/diagnostics` to test API endpoints

### API Health Check Fails
1. Ensure all environment variables are set
2. Check MongoDB connection string
3. Verify JWT_SECRET is set

### Upload Not Working
1. Configure Cloudinary credentials
2. Check if MongoDB is connected
3. Verify JWT token is valid

## 📝 Notes
- The default password hash is for `password123`
- MongoDB can be local or Atlas
- Cloudinary is required for image uploads
- All API endpoints are prefixed with `/api`
