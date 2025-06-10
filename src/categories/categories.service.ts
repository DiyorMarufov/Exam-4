import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { categories } from './models/category.model';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { catchError } from 'src/utils/error-catch';
import { FileService } from 'src/file/file.service';
import { Sequelize } from 'sequelize-typescript';
import { categoriesImage } from './models/category.images.model';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(categories)
    private readonly categoryModel: typeof categories,
    @InjectModel(categoriesImage)
    private readonly categoryImageModel: typeof categoriesImage,
    private readonly fileService: FileService,
    private readonly sequelize: Sequelize,
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
    files?: Express.Multer.File[],
  ): Promise<object> {
    const transaction = await this.sequelize.transaction();
    try {
      const newCategory = await this.categoryModel.create({
        ...createCategoryDto,
        transaction,
      });

      const imagesUrl: string[] = [];
      if (files && files.length > 0) {
        for (let file of files) {
          imagesUrl.push(await this.fileService.createFile(file));
        }
        const images = imagesUrl.map((image) => ({
          image_url: image,
          category_id: newCategory.id,
        }));

        await this.categoryImageModel.bulkCreate(images, { transaction });
      }
      await transaction.commit();
      const category = await this.categoryModel.findOne({
        where: { id: newCategory.id },
        include: { all: true },
      });
      return { data: category };
    } catch (error) {
      await transaction.rollback();
      return catchError(error);
    }
  }

  async findAll(): Promise<categories[]> {
    try {
      return await this.categoryModel.findAll({ include: { all: true } });
    } catch (error) {
      return catchError(error);
    }
  }

  async findOne(id: number): Promise<categories> {
    try {
      const category = await this.categoryModel.findByPk(id);
      if (!category) {
        throw new NotFoundException(`IDsi ${id} bolgan kategoriya topilmadi`);
      }
      return category;
    } catch (error) {
      return catchError(error);
    }
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<categories> {
    try {
      const category = await this.findOne(id);
      return await category.update(updateCategoryDto);
    } catch (error) {
      return catchError(error);
    }
  }

  async remove(id: number): Promise<object> {
    try {
      const count = await this.categoryModel.destroy({ where: { id } });
      if (count === 0) {
        throw new BadRequestException(`Data with ${id} not found`);
      }
      return {
        data: {},
      };
    } catch (error) {
      return catchError(error);
    }
  }
}
