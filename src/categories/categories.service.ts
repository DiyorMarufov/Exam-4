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

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(categories)
    private readonly categoryModel: typeof categories,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<object> {
    try {
      const category = await this.categoryModel.create({
        ...createCategoryDto,
      });
      return successRes(category);
    } catch (error) {
      return catchError(error);
    }
  }

  async findAll(): Promise<object> {
    try {
      return successRes(await this.categoryModel.findAll());
    } catch (error) {
      return catchError(error);
    }
  }

  async findOne(id: number): Promise<object> {
    try {
      const category = await this.categoryModel.findByPk(id);
      if (!category) {
        throw new NotFoundException(`IDsi ${id} bolgan kategoriya topilmadi`);
      }
      return successRes(category);
    } catch (error) {
      return catchError(error);
    }
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<object> {
    try {
      const [count, rows] = await this.categoryModel.update(updateCategoryDto, {
        where: { id },
        returning: true,
      });

      if (!count) {
        throw new BadRequestException(
          `Data with ID ${id} not found or not updated`,
        );
      }

      return successRes(rows[0]);
    } catch (e) {
      return catchError(e);
    }
  }

  async remove(id: number): Promise<object> {
    try {
      const count = await this.categoryModel.destroy({ where: { id } });
      if (!count) {
        throw new BadRequestException(
          `Data with ID ${id} not found or not deleted`,
        );
      }
      return successRes();
    } catch (error) {
      return catchError(error);
    }
  }
}
