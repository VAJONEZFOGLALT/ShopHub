import { BadRequestException, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor() {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (cloudName && apiKey && apiSecret) {
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
      });
    }
  }

  async uploadImage(
    file: Express.Multer.File,
    folder = 'products',
  ): Promise<{ url: string; publicId: string }> {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      throw new ServiceUnavailableException('Cloudinary is not configured');
    }

    const dataUri = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

    const result: UploadApiResponse = await cloudinary.uploader.upload(dataUri, {
      folder,
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  }
}
