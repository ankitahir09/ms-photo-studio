# Cloudinary 401 Unauthorized Error - Complete Fix Guide

## 🔍 Root Cause Analysis

The 401 error occurs because Cloudinary is rejecting the signed upload request. Common causes:

1. **Signature Mismatch**: The signature calculated doesn't match what Cloudinary expects
2. **Missing/Incorrect Environment Variables**: API key, secret, or cloud name not set correctly
3. **Parameter Mismatch**: Parameters in signature don't match what's sent in FormData
4. **Timestamp Issues**: Timestamp format or expiration

## ✅ Solution 1: Fixed Signed Uploads (Current Implementation)

### Backend Fix (`api/videos/signature.js`)

**Key Changes:**
- ✅ Added environment variable validation
- ✅ Fixed signature calculation (all values as strings)
- ✅ Added debug logging
- ✅ Better error messages

### Frontend Fix (`src/pages/VideoUploadPage.jsx`)

**Key Changes:**
- ✅ Uses `resource_type` from signature response
- ✅ Ensures timestamp is string in FormData
- ✅ Better error handling with Cloudinary response details

### Testing Steps:

1. **Verify Environment Variables** (in Vercel Dashboard):
   ```
   CLOUDINARY_CLOUD_NAME=dkmv3uyvz
   CLOUDINARY_API_KEY=your-full-api-key
   CLOUDINARY_API_SECRET=your-full-api-secret
   ```

2. **Check Server Logs** (Vercel Functions Logs):
   - Look for "=== Cloudinary Signature Debug ==="
   - Verify params string and signature are generated

3. **Check Browser Console**:
   - Look for "Upload params:" log
   - Verify all parameters are present

4. **Check Network Tab**:
   - Inspect the Cloudinary upload request
   - Check the response body for specific error message

## ✅ Solution 2: Unsigned Upload Preset (Easier Alternative)

### Why Use Unsigned Uploads?

- ✅ Simpler - no signature calculation needed
- ✅ Less error-prone
- ✅ Still secure (preset can be restricted)
- ⚠️ Less control (preset settings are fixed)

### Setup Steps:

#### 1. Create Upload Preset in Cloudinary Dashboard

1. Go to: https://console.cloudinary.com/settings/upload
2. Click "Add upload preset"
3. Configure:
   - **Preset name**: `video-upload` (or your choice)
   - **Signing mode**: `Unsigned`
   - **Folder**: `murlidhar-studio/videos`
   - **Resource type**: `Video`
   - **Allowed formats**: `mp4, mov, avi, webm, ogg`
   - **Max file size**: `100MB` (or your limit)
   - **Access mode**: `Public` (or `Authenticated` for private)

#### 2. Set Environment Variable

In Vercel Dashboard → Settings → Environment Variables:
```
CLOUDINARY_UPLOAD_PRESET=video-upload
```

#### 3. Update Frontend Code

Replace the `handleUpload` function in `VideoUploadPage.jsx` with the unsigned version (see `VideoUploadPage-unsigned.jsx.example`).

## 🔐 Security Analysis

### Current Implementation (Signed Uploads)

✅ **Secure:**
- API secret never exposed (stays on server)
- Signature generated server-side
- JWT authentication required
- Timestamp prevents replay attacks

⚠️ **API Key Exposure:**
- API key is sent to frontend
- **This is SAFE** - Cloudinary API keys are public identifiers
- They don't grant access without the secret
- This is standard practice for Cloudinary

### Unsigned Upload Preset

✅ **Secure if configured properly:**
- Preset can restrict file types, sizes, folders
- Can set access mode (public/authenticated)
- No API secret needed in frontend

⚠️ **Considerations:**
- Preset settings are fixed (less flexible)
- Anyone with preset name can upload (if preset is public)
- Use authenticated access mode for sensitive content

## 🧪 Testing Both Methods

### Test Signed Uploads:

```javascript
// In browser console after login:
fetch('/api/videos/signature', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  },
  body: JSON.stringify({
    timestamp: Math.round(Date.now() / 1000),
    folder: 'murlidhar-studio/videos'
  })
})
.then(r => r.json())
.then(console.log);
```

### Test Unsigned Upload Preset:

```javascript
// In browser console after login:
fetch('/api/videos/signature-unsigned', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  },
  body: JSON.stringify({
    folder: 'murlidhar-studio/videos'
  })
})
.then(r => r.json())
.then(console.log);
```

## 🐛 Debugging Checklist

If 401 persists, check:

- [ ] Environment variables are set correctly in Vercel
- [ ] API key matches Cloudinary dashboard
- [ ] API secret matches Cloudinary dashboard
- [ ] Cloud name is `dkmv3uyvz` (matches your account)
- [ ] Timestamp is current (within 1 hour)
- [ ] All parameters in FormData match signature parameters
- [ ] Signature params string matches what's sent
- [ ] No extra parameters in FormData that aren't in signature

## 📝 Quick Fix: Switch to Unsigned

If signed uploads continue to fail, quickly switch to unsigned:

1. Create preset in Cloudinary (5 minutes)
2. Set `CLOUDINARY_UPLOAD_PRESET` env var
3. Update frontend to use unsigned endpoint
4. Test upload

This is the fastest path to a working solution.

