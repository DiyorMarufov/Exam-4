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

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(categories)
    private readonly categoryModel: typeof categories,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<categories> {
    try {
      const category = await this.categoryModel.create({
        ...createCategoryDto,
      });
      return category;
    } catch (error) {
      return catchError(error);
    }
  }

  async findAll(): Promise<categories[]> {
    try {
      return await this.categoryModel.findAll();
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
