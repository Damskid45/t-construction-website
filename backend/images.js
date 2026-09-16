import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const CLOUDINARY_ENABLED = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET
);

if (CLOUDINARY_ENABLED) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  console.log('[images] Using Cloudinary for image storage.');
} else {
  console.log('[images] Cloudinary not configured — falling back to local disk storage (uploads/gallery).');
}

const localUploadDir = path.join(process.cwd(), 'uploads', 'gallery');
if (!fs.existsSync(localUploadDir)) {
  fs.mkdirSync(localUploadDir, { recursive: true });
}

/**
 * Stores an in-memory file buffer (from multer memoryStorage) either to
 * Cloudinary or to local disk, and returns the URL/path to save in the DB.
 */
export async function storeImage(file) {
  if (!file) return null;

  if (CLOUDINARY_ENABLED) {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 't-construction/gallery' },
        (err, res) => (err ? reject(err) : resolve(res))
      );
      stream.end(file.buffer);
    });
    return result.secure_url;
  }

  // Local disk fallback
  const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
  fs.writeFileSync(path.join(localUploadDir, uniqueName), file.buffer);
  return `/uploads/gallery/${uniqueName}`;
}

export { CLOUDINARY_ENABLED };
