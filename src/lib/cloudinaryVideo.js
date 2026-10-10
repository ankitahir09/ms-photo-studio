import cloudinary from "./cloudinary";

// Supported video formats
export const ALLOWED_VIDEO_FORMATS = ["mp4", "mov", "webm", "avi"];
export const ALLOWED_VIDEO_MIME_TYPES = [
  "video/mp4",
  "video/quicktime",
  "video/webm",
  "video/x-msvideo",
];

// Maximum video size: 100MB
export const MAX_VIDEO_SIZE_BYTES = 100 * 1024 * 1024;

/**
 * Uploads a video buffer directly to Cloudinary under the dedicated "videos" folder
 * @param {Buffer} buffer - Video file buffer
 * @param {Object} options - Upload options (filename, title, etc.)
 * @returns {Promise<Object>} Cloudinary upload result
 */
export async function uploadVideoToCloudinary(buffer, options = {}) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "video",
        folder: "videos",
        chunk_size: 6000000, // 6MB chunks for smoother video processing
        ...options,
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary Video Upload Error:", error);
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    uploadStream.end(buffer);
  });
}

/**
 * Deletes a video from Cloudinary by its public_id
 * @param {string} publicId - Cloudinary public_id
 * @returns {Promise<Object>} Cloudinary deletion result
 */
export async function deleteVideoFromCloudinary(publicId) {
  return cloudinary.uploader.destroy(publicId, {
    resource_type: "video",
    invalidate: true,
  });
}
