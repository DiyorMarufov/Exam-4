import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSellerProfileDto } from './dto/create-seller-profile.dto';
import { UpdateSellerProfileDto } from './dto/update-seller-profile.dto';
import { InjectModel } from '@nestjs/sequelize';
import { SellerProfile } from './model/seller-profile.model';
import { catchError } from '../utils/catch-error';

@Injectable()
export class SellerProfilesDbService {
  constructor(
    @InjectModel(SellerProfile)
    private sellerProfileModel: typeof SellerProfile,
  ) {}

  async create(
    createSellerProfileDto: CreateSellerProfileDto,
  ): Promise<SellerProfile | undefined> {
    try {
      return await this.sellerProfileModel.create({
        ...createSellerProfileDto,
      });
    } catch (error) {
      catchError(error);
    }
  }

  async findAll(): Promise<SellerProfile[] | undefined> {
    try {
      return await this.sellerProfileModel.findAll();
    } catch (error) {
      catchError(error);
    }
  }

  async findOne(id: number): Promise<SellerProfile | undefined> {
    try {
      const sellerProfile = await this.sellerProfileModel.findByPk(id);
      if (!sellerProfile) {
        throw new NotFoundException('Bunday id lik sellerProfile topilmadi');
      }
      return sellerProfile;
    } catch (error) {
      catchError(error);
    }
  }

  async update(
    id: number,
    updateSellerProfileDto: UpdateSellerProfileDto,
  ): Promise<object | undefined> {
    try {
      const updated = await this.sellerProfileModel.update(
        updateSellerProfileDto,
        {
          where: { id },
          returning: true,
        },
      );
      return { data: updated[1][0], statusCode: 200, message: 'Success' };
    } catch (error) {
      catchError(error);
    }
  }

  async remove(id: number): Promise<object | undefined> {
    try {
      const sellerProfile = await this.sellerProfileModel.findOne({
        where: { id },
      });
      if (!sellerProfile) {
        throw new NotFoundException();
      }
      await this.sellerProfileModel.destroy({ where: { id } });
      return { data: {}, statusCode: 200, message: 'Success' };
    } catch (error) {
      catchError(error);
    }
  }
}
