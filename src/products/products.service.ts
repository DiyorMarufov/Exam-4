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

@Injectable()
export class ProductsService {
  constructor(@InjectModel(products) private productModel: typeof products) {}

  async create(createProductDto: CreateProductDto): Promise<products> {
    try {
      return await this.productModel.create({ ...createProductDto });
    } catch (error) {
      return catchError(error);
    }
  }

  async findAll(): Promise<products[]> {
    try {
      return await this.productModel.findAll();
    } catch (error) {
      return catchError(error);
    }
  }

  async findOne(id: number): Promise<products> {
    try {
      const product = await this.productModel.findByPk(id);
      if (!product) {
        throw new NotFoundException(`Mahsulot id: ${id} topilmadi`);
      }
      return product;
    } catch (error) {
      return catchError(error);
    }
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<products> {
    try {
      const product = await this.findOne(id);
      return await product.update(updateProductDto);
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
        data: {},
      };
    } catch (error) {
      return catchError(error);
    }
  }
}
