import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { categories } from './models/category.model';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

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
      throw new InternalServerErrorException(
        'Kategoriya yaratishda xatolik yuz berdi',);
    }
  }

  async findAll(): Promise<categories[]> {
    try {
      return await this.categoryModel.findAll();
    } catch (error) {
      throw new InternalServerErrorException(
        'Kategoriyalarni olishda xatolik yuz berdi',
        error.message,
      );
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
      throw new InternalServerErrorException(
        'Kategoriya topishda xatolik yuz berdi',
        error.message,
      );
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
      throw new InternalServerErrorException(
        'Kategoriyani yangilashda xatolik yuz berdi',
        error.message,
      );
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const category = await this.findOne(id);
      await category.destroy();
    } catch (error) {
      throw new InternalServerErrorException(
        'Kategoriyani ochirishda xatolik yuz berdi',
        error.message,
      );
    }
  }
}
