import { Controller, Get, Query, Res, BadRequestException } from '@nestjs/common';
import { Response } from 'express';
import { ImageService } from './image.service';

@Controller('api/image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Get()
  async resizeImage(
    @Query('path') path: string,
    @Query('width') width: string,
    @Query('height') height: string,
    @Res() res: Response
  ) {
    if (!path || !width || !height) {
      throw new BadRequestException('path, width, and height are required');
    }

    const w = parseInt(width, 10);
    const h = parseInt(height, 10);

try {
    const filePath = await this.imageService.getOrCreateResizedImage(path, w, h);
    return res.sendFile(filePath);
} catch (error) {
    throw new BadRequestException(error.message);
}
  }
}
