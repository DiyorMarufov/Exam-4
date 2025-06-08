import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { products } from './models/product.model';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { catchError } from 'src/utils/error-catch';
import { FileService } from '../file/file.service';
import { successRes } from '../utils/success-response';
import { Seller } from '../seller/model/seller.model';
import { categories } from '../categories/models/category.model';
import { Op } from 'sequelize';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(products) private productModel: typeof products,
    @InjectModel(Seller) private sellerModel: typeof Seller,
    @InjectModel(categories) private categoryModel: typeof categories,
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
    file?: Express.Multer.File,
    req?: { user: { id: any } },
  ): Promise<object> {
    try {
      const product = await this.productModel.findByPk(id);
      if (!product) {
        throw new NotFoundException(`Product with ID ${id} not found `);
      }

      if (req?.user.id !== product.dataValues.seller_id) {
        throw new BadRequestException(`You are not the owner of this product`);
      }

      let image = product.dataValues.image;

      if (file) {
        if (image && (await this.fileService.existsFile(image))) {
          await this.fileService.deleteFile(image);
        }
        image = await this.fileService.createFile(file);
      }

      const updatedProduct = await this.productModel.update(
        { ...updateProductDto, image },
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

  async remove(id: number, req?: { user: { id: any } }): Promise<object> {
    try {
      const product = await this.productModel.findByPk(id);
      if (!product) {
        throw new NotFoundException(`Data with ID ${id} not found`);
      }

      if (req?.user.id !== product.dataValues.seller_id) {
        throw new BadRequestException(`You are not the owner of this product`);
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
