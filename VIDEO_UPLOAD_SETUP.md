# Video Upload Setup - Unsigned Preset Guide

## ✅ Changes Made

### 1. Backend (`api/videos/signature-unsigned.js`)
- ✅ Returns upload preset configuration (no signature generation)
- ✅ Uses preset name "videos" (or from `CLOUDINARY_UPLOAD_PRESET` env var)
- ✅ Requires JWT authentication (admin-only)
- ✅ Returns cloud name and preset name to frontend

### 2. Frontend (`src/pages/VideoUploadPage.jsx`)
- ✅ Switched from signed uploads to unsigned preset uploads
- ✅ File type validation: Only MP4, MOV, AVI allowed
- ✅ File size validation: 100 MB maximum enforced
- ✅ Progress indicator with percentage display
- ✅ Success/error message display
- ✅ Video preview in uploaded videos list
- ✅ Category selection dropdown

## 🔧 Environment Variables

Make sure these are set in Vercel Dashboard:

```env
CLOUDINARY_CLOUD_NAME=dkmv3uyvz
CLOUDINARY_UPLOAD_PRESET=videos  # Optional - defaults to "videos" if not set
```

**Note**: `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET` are NOT needed for unsigned uploads.

## 📋 Cloudinary Preset Configuration

Your preset "videos" should be configured as:

- **Preset name**: `videos`
- **Signing mode**: `Unsigned`
- **Resource type**: `Video`
- **Folder**: `murlidhar-studio/videos`
- **Allowed formats**: `mp4, mov, avi` (or all video formats)
- **Max file size**: `100MB` (or your limit)

## 🧪 Testing

1. **Login** to admin panel
2. **Navigate** to `/upload-video`
3. **Select category** (kids videos, cinematic videos, or prewedding videos)
4. **Choose video file** (MP4, MOV, or AVI, max 100MB)
5. **Click Upload** - should show progress bar
6. **Check console** for debug logs:
   ```
   === Cloudinary Unsigned Upload Debug ===
   Cloud name: dkmv3uyvz
   Upload preset: videos
   Folder: murlidhar-studio/videos
   ```

## 🔐 Security Notes

- ✅ **JWT Authentication**: Required to get preset configuration
- ✅ **No API Secret Exposure**: Secret never leaves server
- ✅ **Preset Restrictions**: Can be configured in Cloudinary dashboard
- ⚠️ **Preset Name**: Anyone with preset name can upload (if preset is public)
  - Consider using "Authenticated" access mode in preset settings for extra security

## 🐛 Troubleshooting

### 401 Unauthorized
- Check preset name matches exactly: "videos"
- Verify preset is set to "Unsigned" in Cloudinary dashboard
- Check cloud name is correct: `dkmv3uyvz`

### 400 Bad Request
- Verify file type is MP4, MOV, or AVI
- Check file size is under 100MB
- Verify preset allows video resource type

### Upload Succeeds but Not Saved
- Check MongoDB connection
- Verify `/api/videos/save` endpoint is working
- Check browser console for save errors

