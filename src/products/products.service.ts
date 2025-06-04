import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { products } from './models/product.model';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { catchError } from 'src/utils/error-catch';
import { FileService } from '../file/file.service';
import { successRes } from '../utils/success-response';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(products) private productModel: typeof products,
    private readonly fileService: FileService,
  ) {}

  async create(
    createProductDto: CreateProductDto,
    file?: Express.Multer.File,
  ): Promise<object> {
    try {
      let image: string | undefined;

      if (file) {
        image = await this.fileService.createFile(file);
      }

      const newProduct = await this.productModel.create({
        ...createProductDto,
        image,
      });

      return successRes(newProduct, 201);
    } catch (error) {
      return catchError(error);
    }
  }

  async findAll(): Promise<object> {
    try {
      return successRes(await this.productModel.findAll());
    } catch (error) {
      return catchError(error);
    }
  }

  async findOne(id: number): Promise<object> {
    try {
      const product = await this.productModel.findByPk(id);
      if (!product) {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }
      return successRes(product);
    } catch (error) {
      return catchError(error);
    }
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
    file?: Express.Multer.File,
  ): Promise<object> {
    try {
      const product = await this.productModel.findByPk(id);
      if (!product) {
        throw new NotFoundException(`Product with ID ${id} not found `);
      }

      let image = product.dataValues.image;

      if (file) {
        if (image && (await this.fileService.existsFile(image))) {
          await this.fileService.deleteFile(image);
        }
        image = await this.fileService.createFile(file);
      }

      const updatedProduct = await this.productModel.update(
        { updateProductDto, image },
        {
          where: { id },
          returning: true,
        },
      );

      return successRes(updatedProduct[1][0]);
    } catch (error) {
      return catchError(error);
    }
  }

  async remove(id: number): Promise<object> {
    try {
      const product = await this.productModel.findByPk(id);
      if (!product) {
        throw new NotFoundException(`Data with ID ${id} not found`);
      }
      const { image } = product?.dataValues;
      if (image && (await this.fileService.existsFile(image))) {
        await this.fileService.deleteFile(image);
      }
      await this.productModel.destroy({ where: { id } });
      return successRes();
    } catch (error) {
      return catchError(error);
    }
  }
}
