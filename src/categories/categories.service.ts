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

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(categories)
    private readonly categoryModel: typeof categories,
    private readonly fileService: FileService,
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
    file?: Express.Multer.File,
  ): Promise<object> {
    try {
      let image: undefined | string;

      if (file) {
        image = await this.fileService.createFile(file);
      }

      const category = await this.categoryModel.create({
        ...createCategoryDto,
        image,
      });
      return successRes(category);
    } catch (error) {
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
    file?: Express.Multer.File,
  ): Promise<object> {
    try {
      const category = await this.categoryModel.findByPk(id);

      if (!category) {
        throw new NotFoundException(`Category with ID ${id} not found`);
      }

      let image = category.dataValues.image;

      if (file) {
        if (image && (await this.fileService.existsFile(image))) {
          await this.fileService.deleteFile(image);
        }
        image = await this.fileService.createFile(file);
      }

      const updatedCategory = await this.categoryModel.update(
        {
          ...updateCategoryDto,
          image,
        },
        { where: { id }, returning: true },
      );

      return successRes(updatedCategory[1][0]);
    } catch (e) {
      return catchError(e);
    }
  }

  async remove(id: number): Promise<object> {
    try {
      const category = await this.categoryModel.findByPk(id);

      if (!category) {
        throw new NotFoundException(`Category with ID ${id} not found`);
      }

      const { image } = category?.dataValues;
      if (image && (await this.fileService.existsFile(image))) {
        await this.fileService.deleteFile(image);
      }
      await this.categoryModel.destroy({ where: { id } });
      return successRes();
    } catch (error) {
      return catchError(error);
    }
  }
}
