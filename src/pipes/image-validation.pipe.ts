import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { extname } from 'path';
import { catchError } from '../utils/error-catch';

@Injectable()
export class ImageValidationPipe implements PipeTransform {
  private readonly allowedExtensions = [
    '.jpeg',
    '.jpg',
    '.png',
    '.svg',
    '.heic',
    '.webp',
  ];

  transform(value: any, metadata: ArgumentMetadata) {
    try {
      if (value) {
        const file = value.originalname;
        const ext = extname(file).toLowerCase();
        if (!this.allowedExtensions.includes(ext)) {
          throw new BadRequestException(
            `Only allowed files: ${this.allowedExtensions.join('. ')}`,
          );
        }
      }
      return value;
    } catch (e) {
      return catchError(e);
    }
  }
}
