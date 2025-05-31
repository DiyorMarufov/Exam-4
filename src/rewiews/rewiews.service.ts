import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { reviews } from './models/rewiew.models';
import { CreateReviewDto } from './dto/create-rewiew.dto';
import { UpdateReviewDto } from './dto/update-rewiew.dto';
import { catchError } from 'src/utils/error-catch';

@Injectable()
export class RewiewsService {
  constructor(
    @InjectModel(reviews)
    private readonly reviewModel: typeof reviews,
  ) {}

  async create(createReviewDto: CreateReviewDto): Promise<reviews> {
    try {
      return await this.reviewModel.create({ ...createReviewDto });
    } catch (error) {
      return catchError(error);
    }
  }

  async findAll(): Promise<reviews[]> {
    try {
      return await this.reviewModel.findAll();
    } catch (error) {
      return catchError(error);
    }
  }

  async findOne(id: number): Promise<reviews> {
    try {
      const review = await this.reviewModel.findByPk(id);
      if (!review) {
        throw new NotFoundException(`Review with ID ${id} not found`);
      }
      return review;
    } catch (error) {
      return catchError(error);
    }
  }

  async update(id: number, updateReviewDto: UpdateReviewDto): Promise<reviews> {
    try {
      const review = await this.findOne(id);
      return await review.update(updateReviewDto);
    } catch (error) {
      return catchError(error);
    }
  }

  async remove(id: number): Promise<object> {
    try {
      const count = await this.reviewModel.destroy({ where: { id } });

      if (count === 0) {
        throw new BadRequestException(
          `Data with ID ${id} not found or not deleted`,
        );
      }
      return {
        data: {},
      };
    } catch (error) {
      return catchError(error);
    }
  }
}
