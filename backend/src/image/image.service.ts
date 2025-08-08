import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import * as path from 'path';
import * as fs from 'fs';
import * as crypto from 'crypto';

@Injectable()
export class ImageService {
  private cacheDir = path.join(process.cwd(), 'tmp');
  private uploadsDir = path.join(process.cwd(), 'uploads');

  constructor() {
    if (!fs.existsSync(this.cacheDir)) {
      fs.mkdirSync(this.cacheDir, { recursive: true });
    }
  }

  private getCacheFilename(relativePath: string, width: number, height: number): string {
    const hash = crypto
      .createHash('md5')
      .update(`${relativePath}-${width}-${height}`)
      .digest('hex');
    return `${hash}.webp`;
  }

  async getOrCreateResizedImage(relativePath: string, width: number, height: number): Promise<string> {
    const cacheFile = path.join(this.cacheDir, this.getCacheFilename(relativePath, width, height));

    if (fs.existsSync(cacheFile)) {
      return cacheFile; 
    }
    
    const originalFile = path.join(this.uploadsDir, relativePath);

    if (!fs.existsSync(originalFile)) {
      throw new Error(`Original image not found: ${relativePath}`);
    }

    await sharp(originalFile)
      .resize(width, height, { fit: 'cover' })
      .webp({ quality: 100 })
      .toFile(cacheFile);

    return cacheFile;
  }
}
