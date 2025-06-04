import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateSellerProfileDto } from './dto/create-seller-profile.dto';
import { UpdateSellerProfileDto } from './dto/update-seller-profile.dto';
import { InjectModel } from '@nestjs/sequelize';
import { SellerProfile } from './model/seller-profile.model';
import { catchError } from '../utils/error-catch';
import { successRes } from '../utils/success-response';

@Injectable()
export class SellerProfilesDbService {
  constructor(
    @InjectModel(SellerProfile)
    private sellerProfileModel: typeof SellerProfile,
  ) {}

  async create(
    createSellerProfileDto: CreateSellerProfileDto,
  ): Promise<object | undefined> {
    try {
      const newSellerProfile = await this.sellerProfileModel.create({
        ...createSellerProfileDto,
      });

      return successRes(newSellerProfile, 201);
    } catch (error) {
      return catchError(error);
    }
  }

  async findAll(): Promise<object | undefined> {
    try {
      return successRes(await this.sellerProfileModel.findAll());
    } catch (error) {
      return catchError(error);
    }
  }

  async findOne(id: number): Promise<object | undefined> {
    try {
      const sellerProfile = await this.sellerProfileModel.findByPk(id);
      if (!sellerProfile) {
        throw new NotFoundException(`Seller profile with ID ${id} not found`);
      }
      return successRes(sellerProfile);
    } catch (error) {
      return catchError(error);
    }
  }

  async update(
    id: number,
    updateSellerProfileDto: UpdateSellerProfileDto,
  ): Promise<object | undefined> {
    try {
      const [count, rows] = await this.sellerProfileModel.update(
        updateSellerProfileDto,
        {
          where: { id },
          returning: true,
        },
      );

      if (!count) {
        throw new BadRequestException(
          `Data with ID ${id} not found or not deleted`,
        );
      }

      return successRes(rows[0]);
    } catch (error) {
      return catchError(error);
    }
  }

  async remove(id: number): Promise<object | undefined> {
    try {
      const count = await this.sellerProfileModel.destroy({ where: { id } });

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
