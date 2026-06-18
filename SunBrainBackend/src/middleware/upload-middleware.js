import multer from 'multer';
import path from 'path';
import fs from 'fs';

const TEMP_DIR = 'uploads/tmp';

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    fs.mkdir(TEMP_DIR, { recursive: true }, (error) => cb(error, TEMP_DIR));
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Разрешены только изображения (jpeg, jpg, png, gif, webp)'));
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: fileFilter
});

export const uploadSingle = upload.single('avatar');

// Экспортируем конфигурацию для других случаев
export default upload;
