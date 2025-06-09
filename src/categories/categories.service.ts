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
import { successRes } from '../utils/success-response';
import { FileService } from '../file/file.service';
import { Sequelize } from 'sequelize-typescript';
import { CategoriesImage } from './models/category-image.model';
import { basename } from 'path';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(categories)
    private readonly categoryModel: typeof categories,
    @InjectModel(CategoriesImage)
    private readonly categoryImageModel: typeof CategoriesImage,
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
      return successRes(category, 201);
    } catch (error) {
      await transaction.rollback();
      return catchError(error);
    }
  }

  async findAll(): Promise<object> {
    try {
      const categories = await this.categoryModel.findAll({
        include: { all: true },
      });
      return successRes(categories);
    } catch (error) {
      return catchError(error);
    }
  }

  async findOne(id: number): Promise<object> {
    try {
      const category = await this.categoryModel.findByPk(id, {
        include: { all: true },
      });
      if (!category) {
        throw new NotFoundException(`Category with ID ${id} not found`);
      }
      return successRes(category);
    } catch (error) {
      return catchError(error);
    }
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
    files?: Express.Multer.File[],
  ): Promise<object> {
    const transaction = await this.sequelize.transaction();
    try {
      const category = await this.categoryModel.findByPk(id);

      if (!category) {
        throw new NotFoundException(`Category with ID ${id} not found`);
      }

      await this.categoryModel.update(updateCategoryDto, {
        where: { id },
        transaction,
      });

      if (
        files &&
        updateCategoryDto.imageIds &&
        files.length === updateCategoryDto.imageIds.length
      ) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const imageId = updateCategoryDto.imageIds[i];

          const image = await this.categoryImageModel.findByPk(imageId);
          if (!image || image.dataValues.category_id !== id) {
            throw new NotFoundException(
              `Image with ID ${imageId} not found or doesn't belong to category ${id}`,
            );
          }
          await this.fileService.deleteFile(image.dataValues.image_url);

          const newUrl = await this.fileService.createFile(file);

          await image.update({ image_url: newUrl }, { transaction });
        }
      }
      await transaction.commit();

      const updatedCategory = await this.categoryModel.findOne({
        where: { id },
        include: { all: true },
      });

      return successRes(updatedCategory);
    } catch (e) {
      await transaction.rollback();
      return catchError(e);
    }
  }

  async remove(id: number): Promise<object> {
    try {
      const category = await this.categoryModel.findByPk(id);

      if (!category) {
        throw new NotFoundException(`Category with ID ${id} not found`);
      }

      await category.destroy();
      return successRes();
    } catch (error) {
      return catchError(error);
    }
  }
}
