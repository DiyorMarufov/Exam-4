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
import { productsImage } from './models/products.images.model';
import { FileService } from 'src/file/file.service';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(products)
    private readonly productModel: typeof products,
    @InjectModel(productsImage)
    private readonly productImageModel: typeof productsImage,
    private readonly fileService: FileService,
    private readonly sequelize: Sequelize,
  ) {}
  async create(
    createProductDto: CreateProductDto,
    files?: Express.Multer.File[],
  ): Promise<object> {
    const transaction = await this.sequelize.transaction();
    try {
      const newProduct = await this.productModel.create({
        ...createProductDto,
        transaction,
      });

      const imagesUrl: string[] = [];
      if (files && files.length > 0) {
        for (let file of files) {
          imagesUrl.push(await this.fileService.createFile(file));
        }
        const images = imagesUrl.map((image) => ({
          image_url: image,
          product_id: newProduct.id,
        }));

        await this.productImageModel.bulkCreate(images, { transaction });
      }
      await transaction.commit();
      const product = await this.productModel.findOne({
        where: { id: newProduct.id },
        include: { all: true },
      });
      return { data: product };
    } catch (error) {
      await transaction.rollback();
      return catchError(error);
    }
  }

  async findAll(): Promise<products[]> {
    try {
      return await this.productModel.findAll({ include: { all: true } });
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
