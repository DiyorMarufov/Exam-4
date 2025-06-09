import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { products } from './models/product.model';
import { ProductsImage } from './models/images-of-product.model';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { catchError } from 'src/utils/error-catch';
import { FileService } from '../file/file.service';
import { successRes } from '../utils/success-response';
import { Seller } from '../seller/model/seller.model';
import { categories } from '../categories/models/category.model';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(products) private productModel: typeof products,
    @InjectModel(ProductsImage)
    private imageProductModel: typeof ProductsImage,
    @InjectModel(Seller) private sellerModel: typeof Seller,
    @InjectModel(categories) private categoryModel: typeof categories,
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
        const images = imagesUrl.map((image: string) => ({
          image_url: image,
          product_id: newProduct.id,
        }));
        await this.imageProductModel.bulkCreate(images, { transaction });
      }
      await transaction.commit();
      const product = await this.productModel.findOne({
        where: { id: newProduct.id },
        include: { all: true },
      });
      return successRes(product, 201);
    } catch (error) {
      await transaction.rollback();
      return catchError(error);
    }
  }

  async findAll(query: any): Promise<object> {
    try {
      const where: any = {};
      const categoryWhere: any = {};
      const sellerWhere: any = {};

      if (query.name) {
        where.name = {
          [Op.iLike]: `%${query.name}%`,
        };
      }

      if (query.min_price && query.max_price) {
        where.price = {
          [Op.between]: [Number(query.min_price), Number(query.max_price)],
        };
      } else if (query.min_price) {
        where.price = {
          [Op.gte]: Number(query.min_price),
        };
      } else if (query.max_price) {
        where.price = {
          [Op.lte]: Number(query.max_price),
        };
      }

      if (query.category_id) {
        where.category_id = Number(query.category_id);
      }

      if (query.category_name) {
        categoryWhere.name = {
          [Op.iLike]: `%${query.category_name}%`,
        };
      }

      if (query.seller_id) {
        where.seller_id = Number(query.seller_id);
      }

      if (query.seller_name) {
        sellerWhere.full_name = {
          [Op.iLike]: `%${query.seller_name}%`,
        };
      }
      const products = await this.productModel.findAll({
        where,
        include: [
          {
            model: Seller,
            attributes: ['full_name', 'email', 'phone'],
            where: Object.keys(sellerWhere).length ? sellerWhere : undefined,
          },
          {
            model: categories,
            where: Object.keys(categoryWhere).length
              ? categoryWhere
              : undefined,
          },
          {
            model: ProductsImage,
          },
        ],
      });
      return successRes(products);
    } catch (error) {
      return catchError(error);
    }
  }

  async findOne(id: number): Promise<object> {
    try {
      const product = await this.productModel.findByPk(id, {
        include: [
          {
            model: this.sellerModel,
            attributes: ['full_name', 'email', 'phone'],
          },
          { model: this.categoryModel },
        ],
      });
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
    files?: Express.Multer.File[],
    req?: { user: { id: any } },
  ): Promise<object> {
    const transaction = await this.sequelize.transaction();
    try {
      const product = await this.productModel.findByPk(id);
      if (!product) {
        throw new NotFoundException(`Product with ID ${id} not found `);
      }

      if (req?.user.id !== product.dataValues.seller_id) {
        throw new BadRequestException(`You are not the owner of this product`);
      }

      await this.productModel.update(updateProductDto, {
        where: { id },
        transaction,
      });

      if (
        files &&
        updateProductDto.imageIds &&
        files.length === updateProductDto.imageIds.length
      ) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const imageId = updateProductDto.imageIds[i];

          const image = await this.imageProductModel.findByPk(imageId);
          if (!image || image.dataValues.product_id !== id) {
            throw new NotFoundException(
              `Image with ID ${imageId} not found or doesn't belong to product ${id}`,
            );
          }
          await this.fileService.deleteFile(image.dataValues.image_url);

          const newUrl = await this.fileService.createFile(file);

          await image.update({ image_url: newUrl }, { transaction });
        }
      }
      await transaction.commit();

      const updatedProduct = await this.productModel.findOne({
        where: { id },
        include: { all: true },
      });

      return successRes(updatedProduct);
    } catch (error) {
      return catchError(error);
    }
  }

  async remove(id: number, req?: { user: { id: any } }): Promise<object> {
    try {
      const product = await this.productModel.findByPk(id);
      if (!product) {
        throw new NotFoundException(`Data with ID ${id} not found`);
      }

      if (req?.user.id !== product.dataValues.seller_id) {
        throw new BadRequestException(`You are not the owner of this product`);
      }
      await product.destroy()
      return successRes();
    } catch (error) {
      return catchError(error);
    }
  }
}
