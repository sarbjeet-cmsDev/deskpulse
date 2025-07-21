import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadService {
  buildFileResponse(file: Express.Multer.File) {
    return {
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      url: `${process.env.NEXT_PUBLIC_BACKEND_HOST}/uploads/${file.filename}`,
    };
  }

  buildFilesResponse(files: Express.Multer.File[]) {
    return files.map((f) => this.buildFileResponse(f));
  }
}
