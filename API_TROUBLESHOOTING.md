# API Troubleshooting Guide - Murlidhar Studio

## 🚨 Current Issue: 500 Internal Server Error

The photos are not loading because the backend API is returning a 500 error. This is likely due to missing environment variables or database connection issues.

## 🔧 Required Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# MongoDB Connection
MONGO_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/photo-studio?retryWrites=true&w=majority

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key

# Server Configuration
PORT=5000
NODE_ENV=development
```

## 🛠️ Steps to Fix

### 1. Create Environment File
```bash
# In the root directory (photo-studio/)
touch .env
```

### 2. Add Your Credentials
- **MongoDB**: Get connection string from MongoDB Atlas
- **Cloudinary**: Get credentials from Cloudinary dashboard
- **JWT Secret**: Any random string for authentication

### 3. Start the Backend Server
```bash
# From root directory
npm run dev:api
```

### 4. Start the Frontend
```bash
# From root directory
npm run dev
```

## 🔍 Debugging Steps

### Check Backend Logs
Look for these messages in the terminal:
- ✅ `MongoDB Atlas connected` - Database connected successfully
- ❌ `MongoDB error` - Database connection failed
- 🚀 `Server running on http://localhost:5000` - Server started

### Test API Endpoints
```bash
# Test if server is running
curl http://localhost:5000/api/images/kidsphotography

# Should return JSON with images or empty array
```

### Check Database Connection
The error might be:
1. **Invalid MongoDB URI** - Check connection string
2. **Network issues** - Check internet connection
3. **Database permissions** - Check MongoDB Atlas settings
4. **Missing collections** - Database might be empty

## 📊 Expected API Response

When working correctly, the API should return:
```json
{
  "success": true,
  "category": "childphotos",
  "count": 0,
  "images": []
}
```

## 🚀 Quick Fix for Development

If you want to test the frontend without the backend, you can modify the `usePhotoData.js` hook to return mock data:

```javascript
// Temporary fix in usePhotoData.js
const mockPhotos = [
  {
    public_id: "sample-1",
    url: "https://via.placeholder.com/400x600/000000/FFFFFF?text=Sample+Photo+1",
    category: category
  }
];

// Use mock data when API fails
if (error) {
  setPhotos(mockPhotos);
  setError(null);
}
```

## 📞 Next Steps

1. **Set up MongoDB Atlas** account if not already done
2. **Set up Cloudinary** account for image storage
3. **Create the .env file** with proper credentials
4. **Restart both servers** after adding environment variables
5. **Test the API endpoints** to ensure they're working

## 🔗 Useful Links

- [MongoDB Atlas Setup](https://docs.atlas.mongodb.com/getting-started/)
- [Cloudinary Setup](https://cloudinary.com/documentation/node_integration)
- [Environment Variables Guide](https://nodejs.org/en/learn/command-line/how-to-read-environment-variables-from-nodejs)
