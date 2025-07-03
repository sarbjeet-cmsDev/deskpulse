import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

export const multerOptions = {
  storage: diskStorage({
    destination: 'uploads',
    filename: (req, file, callback) => {
      const uniqueSuffix = `${uuidv4()}${extname(file.originalname)}`;
      callback(null, uniqueSuffix);
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req: any, file: Express.Multer.File, callback: any) => {
    const allowedMimeTypes = [
      // Images
      'image/jpeg', 'image/jpg', 'image/png', 'image/webp',

      // Audio
      'audio/mpeg', // .mp3
      'audio/wav',  // .wav
      'audio/x-wav',
      'audio/mp4',  // .m4a
      'audio/x-aac',
      'audio/ogg',
      'audio/aiff',
      'audio/x-aiff',

      // Video
      'video/mp4',
      'video/x-matroska', // .mkv
      'video/webm',
      'video/ogg',
      'video/quicktime',  // .mov
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      return callback(new Error('Only image, audio, and video files are allowed!'), false);
    }

    callback(null, true);
  },
};