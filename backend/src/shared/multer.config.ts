import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as dotenv from 'dotenv';

dotenv.config({ path: "../.env" });


const fileSizeLimit = Number(process.env.NEXT_PUBLIC_MAX_FILE_SIZE) || 10;

export const multerOptions = {
  storage: diskStorage({
    destination: 'uploads',
    filename: (req, file, callback) => {
      const uniqueSuffix = `${uuidv4()}${extname(file.originalname)}`;
      callback(null, uniqueSuffix);
    },
  }),
  limits: {
    fileSize: fileSizeLimit * 1024 * 1024,
  },
  fileFilter: (req: any, file: Express.Multer.File, callback: any) => {
    const allowedMimeTypes = [
      // Images
      'image/jpeg', 'image/jpg', 'image/png', 'image/webp',

      // Audio
      'audio/mpeg', 
      'audio/wav',  
      'audio/x-wav',
      'audio/mp4',  
      'audio/x-aac',
      'audio/ogg',
      'audio/aiff',
      'audio/x-aiff',

      // Video
      'video/mp4',
      'video/x-matroska', 
      'video/webm',
      'video/ogg',
      'video/quicktime',  
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      return callback(new Error('Only image, audio, and video files are allowed!'), false);
    }

    callback(null, true);
  },
};