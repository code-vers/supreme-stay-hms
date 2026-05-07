import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

type CloudinaryUploadResponse = {
  secure_url?: string;
  error?: { message?: string };
};

@Injectable()
export class CloudinaryService {
  constructor(private readonly configService: ConfigService) {}

  async uploadImage(
    file: string,
    folder = 'supreme-stay',
  ): Promise<{ secureUrl: string }> {
    try {
      const cloudName = this.configService.get<string>('CLOUDINARY_CLOUD_NAME');
      const apiKey = this.configService.get<string>('CLOUDINARY_API_KEY');
      const apiSecret = this.configService.get<string>('CLOUDINARY_API_SECRET');

      if (!cloudName || !apiKey || !apiSecret) {
        throw new InternalServerErrorException(
          'Cloudinary credentials are not configured',
        );
      }

      const timestamp = Math.floor(Date.now() / 1000);
      const signatureBase = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
      const signature = crypto
        .createHash('sha1')
        .update(signatureBase)
        .digest('hex');

      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', apiKey);
      formData.append('timestamp', String(timestamp));
      formData.append('signature', signature);
      formData.append('folder', folder);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        },
      );

      const rawBody = await response.text();
      let payload: CloudinaryUploadResponse = {};
      try {
        payload = JSON.parse(rawBody) as CloudinaryUploadResponse;
      } catch {
        payload = {};
      }

      if (!response.ok || !payload.secure_url) {
        throw new BadRequestException(
          payload.error?.message || rawBody || 'Image upload failed',
        );
      }

      return { secureUrl: payload.secure_url };
    } catch (error: unknown) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      const message =
        error instanceof Error ? error.message : 'Cloudinary upload failed';
      throw new InternalServerErrorException(
        `Cloudinary upload failed: ${message}`,
      );
    }
  }
}
