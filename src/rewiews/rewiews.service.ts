import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { reviews } from './models/rewiew.models';
import { CreateReviewDto } from './dto/create-rewiew.dto';
import { UpdateRewiewDto } from './dto/update-rewiew.dto';
import { catchError } from 'src/utils/error-catch';
import { successRes } from '../utils/success-response';

@Injectable()
export class RewiewsService {
  constructor(
    @InjectModel(reviews)
    private readonly reviewModel: typeof reviews,
  ) {}

  async create(createReviewDto: CreateReviewDto): Promise<object> {
    try {
      const newReview = await this.reviewModel.create({ ...createReviewDto });
      return successRes(newReview, 201);
    } catch (error) {
      return catchError(error);
    }
  }

  async findAll(): Promise<object> {
    try {
      return successRes(await this.reviewModel.findAll());
    } catch (error) {
      return catchError(error);
    }
  }

  async findOne(id: number): Promise<object> {
    try {
      const review = await this.reviewModel.findByPk(id);
      if (!review) {
        throw new NotFoundException(`Review with ID ${id} not found`);
      }
      return successRes(review);
    } catch (error) {
      return catchError(error);
    }
  }

  async update(id: number, updateReviewDto: UpdateRewiewDto): Promise<object> {
    try {
      const [count, rows] = await this.reviewModel.update(updateReviewDto, {
        where: { id },
        returning: true,
      });

      if (!count) {
        throw new BadRequestException(
          `Data with ID ${id} not updated or not found`,
        );
      }
      return successRes(rows[0]);
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
      return successRes();
    } catch (error) {
      return catchError(error);
    }
  }
}
