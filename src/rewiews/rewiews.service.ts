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
import { products } from '../products/models/product.model';
import { SellerProfile } from '../seller-profiles/model/seller-profile.model';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class RewiewsService {
  constructor(
    @InjectModel(reviews)
    private readonly reviewModel: typeof reviews,
    @InjectModel(SellerProfile)
    private readonly sellerProfileModel: typeof SellerProfile,
    @InjectModel(products)
    private readonly productModel: typeof products,
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
      const reviews = await this.reviewModel.findAll({
        include: { all: true },
      });
      return successRes(reviews);
    } catch (error) {
      return catchError(error);
    }
  }

  async getAverageRating(sellerId: number) {
    try {
      const products = await this.productModel.findAll({
        where: { seller_id: sellerId },
        attributes: ['id'],
      });

      const productIds = products.map((product) => product.id);

      if (!productIds) {
        return successRes(`Seller has no products`);
      }

      const reviews = await this.reviewModel.findAll({
        where: { product_id: productIds },
      });

      if (!reviews.length) {
        return successRes(`Seller has no reviews`);
      }

      const sumRating = reviews.reduce(
        (acc, review) => acc + review?.dataValues?.rating,
        0,
      );
      const averageRating = sumRating / reviews.length;

      const sellerProfile = await this.sellerProfileModel.findOne({
        where: { seller_id: sellerId },
      });
      if (!sellerProfile?.dataValues) {
        throw new NotFoundException(
          `Seller Profile with Seller ID ${sellerId} not found`,
        );
      }
      await this.sellerProfileModel.update(
        {
          average_rating: averageRating,
        },
        { where: { seller_id: sellerId } },
      );

      return successRes(
        `Average rating for seller ID ${sellerId}: ${averageRating}`,
      );
    } catch (e) {
      return catchError(e);
    }
  }

  async findOne(id: number): Promise<object> {
    try {
      const review = await this.reviewModel.findByPk(id, {
        include: { all: true },
      });
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
