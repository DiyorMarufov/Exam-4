import { BadRequestException, Injectable } from '@nestjs/common';
import { existsSync, mkdirSync, unlink, writeFile } from 'fs';
import { extname, join, resolve } from 'path';
import { catchError } from '../utils/error-catch';
import { v4 } from 'uuid';
import {config} from "dotenv"
config()
@Injectable()
export class FileService {
  private readonly baseUrl = String(process.env.BASE_URL);
  private readonly filePath = resolve(__dirname, '..', '..', '..', 'uploads');

  async createFile(file: Express.Multer.File): Promise<string> {
    try {
      const ext = extname(file.originalname);
      const fileName = `${file.originalname.split('.')[0]}_${v4()}${ext}`;

      if (!existsSync(this.filePath)) {
        mkdirSync(this.filePath, { recursive: true });
      }
      await new Promise<void>((res, rej) => {
        writeFile(join(this.filePath, fileName), file.buffer, (e) => {
          if (e) rej(e);
          res();
        });
      });
      
      return `${this.baseUrl}${fileName}`;
    } catch (e) {
      return catchError(e);
    }
  }
}
