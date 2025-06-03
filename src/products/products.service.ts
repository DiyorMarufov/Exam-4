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

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(products) private productModel: typeof products,
    private readonly fileService: FileService,
  ) {}

  async create(
    createProductDto: CreateProductDto,
    file: Express.Multer.File,
  ): Promise<object> {
    try {
      let image: undefined | string;
      
      if (file) {
        image = await this.fileService.createFile(file);
      }
      
      
      const newProduct = await this.productModel.create({
        ...createProductDto,
        image,
      });
      
      return {
        statusCode: 201,
        message: 'success',
        data: newProduct,
      };
    } catch (error) {
      return catchError(error);
    }
  }

  async findAll(): Promise<object> {
    try {
      return {
        statusCode: 200,
        message: 'success',
        data: await this.productModel.findAll(),
      };
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
      return { statusCode: 200, message: 'success', data: product };
    } catch (error) {
      return catchError(error);
    }
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
    file: Express.Multer.File,
  ): Promise<object> {
    try {
      const [count, rows] = await this.productModel.update(updateProductDto, {
        where: { id },
        returning: true,
      });

      if (!count) {
        throw new BadRequestException(
          `Data with ID ${id} not found or not updated`,
        );
      }

      return {
        statusCode: 200,
        message: 'success',
        data: rows[0],
      };
    } catch (error) {
      return catchError(error);
    }
  }

  async remove(id: number): Promise<object> {
    try {
      const product = await this.productModel.destroy({ where: { id } });
      if (!product) {
        throw new BadRequestException(`Data with ID ${id} not found`);
      }
      return {
        statusCode: 200,
        message: 'success',
        data: {},
      };
    } catch (error) {
      return catchError(error);
    }
  }
}
