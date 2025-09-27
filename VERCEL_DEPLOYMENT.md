# Vercel Deployment Guide

## Environment Variables Setup

Add these environment variables to your Vercel project settings:

### Required Variables

1. **MONGO_URI**
   - Your MongoDB Atlas connection string
   - Example: `mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority`

2. **JWT_SECRET**
   - A secure random string for JWT token signing
   - Example: `V!n0d$@2xxxxx` (use a strong, random string)

3. **ADMIN_USERNAME**
   - Your admin username
   - Example: `vixxx`

4. **ADMIN_PASSWORD**
   - Your bcrypt hashed password
   - Example: `$2b$10$zXFufCO97xxKgBUeQ7uvkFSTmqyRee3vHiRDMljLq`

5. **CLOUDINARY_CLOUD_NAME**
   - Your Cloudinary cloud name
   - Example: `dkmxxxxx`

6. **CLOUDINARY_API_KEY**
   - Your Cloudinary API key
   - Example: `2791662xxxx`

7. **CLOUDINARY_API_SECRET**
   - Your Cloudinary API secret
   - Example: `zk0wnxxxxxRdsifmbk`

### Optional Variables

8. **JWT_EXPIRES_IN**
   - JWT token expiration time (default: 1h)
   - Example: `1h` or `24h`

9. **VITE_GA_MEASUREMENT_ID**
   - Google Analytics measurement ID
   - Example: `G-XXXXXXXXXX`

## How to Add Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add each variable with the appropriate value
5. Make sure to add them for all environments (Production, Preview, Development)

## Deployment Steps

1. Connect your GitHub repository to Vercel
2. Set up the environment variables as described above
3. Deploy your project
4. Your API endpoints will be available at:
   - `/api/auth/login`
   - `/api/data/[filename]`
   - `/api/images/[category]`
   - `/api/upload/upload`
   - `/api/delete-image`
   - `/api/update-order`
   - `/api/health`

## Testing the Deployment

1. Visit `/api/health` to check if the database connection is working
2. Test the admin login at `/api/auth/login`
3. Verify image uploads and retrieval work correctly

## Notes

- The frontend will automatically use same-origin requests for API calls when deployed on Vercel
- All serverless functions include proper CORS headers
- MongoDB connections are cached for optimal performance
- File uploads use Cloudinary for cloud storage
