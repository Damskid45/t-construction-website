import multer from 'multer';
import path from 'path';

// Files are kept in memory as buffers, then handed to storeImage() (see
// images.js) which sends them to Cloudinary if configured, or writes them
// to local disk otherwise. This keeps the route code storage-agnostic.
const storage = multer.memoryStorage();

function fileFilter(req, file, cb) {
  const allowed = ['.jpg', '.jpeg', '.png', '.webp'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (jpg, png, webp) are allowed.'));
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 8 * 1024 * 1024 } // 8MB per image
});

export default upload;
