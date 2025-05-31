import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Seller } from './model/seller.model';
import { CreateSellerDto } from './dto/create-seller.dto';
import { decrypt, encrypt } from 'src/utils/encrypt-decrypt';
import { Roles } from 'src/ENUM';
import { catchError } from 'src/utils/catch-error';
import { SignInSellerDto } from './dto/sing-in-seller.dto';
import { TokenService } from 'src/utils/generate-token';
import { writeToCookie } from 'src/utils/write-cookie';
import { Response } from 'express';

@Injectable()
export class SellerService {
  constructor(
    @InjectModel(Seller)
    private sellerModel: typeof Seller,
    private readonly tokenService: TokenService,
  ) {}

  async signUp(createSellerDto: CreateSellerDto): Promise<object> {
    try {
      const existingEmail = await this.sellerModel.findOne({
        where: { email: createSellerDto.email },
      });
      const existingPhone = await this.sellerModel.findOne({
        where: { phone: createSellerDto.phone },
      });
      if (existingEmail) {
        throw new BadRequestException('Email already exists');
      }
      if (existingPhone) {
        throw new BadRequestException('Phone number already exists');
      }

      const { password } = createSellerDto;
      const hashed_password = await encrypt(password);

      const newSeller = await this.sellerModel.create({
        ...createSellerDto,
        hashed_password,
        role: Roles.SELLER,
      });
      return newSeller;
    } catch (error) {
      return catchError(error);
    }
  }

  async signIn(
    signInSellerDto: SignInSellerDto,
    res: Response,
  ): Promise<object> {
    try {
      const { email, password } = signInSellerDto;
      const seller = await this.sellerModel.findOne({ where: { email } });
      if (!seller) {
        throw new BadRequestException('Email or password incorrect');
      }
      const { hashed_password } = seller?.dataValues;
      const isMatchPassword = await decrypt(password, hashed_password);
      if (!isMatchPassword) {
        throw new BadRequestException('Email or password incorrect');
      }
      const payload = { id: seller.id, role: seller.role, email: seller.email };
      const accessToken = await this.tokenService.generateAccessToken(payload);
      const refreshToken =
        await this.tokenService.generateRefreshToken(payload);
      writeToCookie(res, 'refreshTokenSeller', refreshToken);
      return {
        statusCode: 200,
        message: 'success',
        data: accessToken,
      };
    } catch (error) {
      return catchError(error);
    }
  }

  async findAll(): Promise<object> {
    const sellers = await this.sellerModel.findAll();
    return { statuscode: 200, data: { sellers } };
  }

  async findOne(id: number): Promise<object> {
    const seller = await this.sellerModel.findByPk(id);
    return { statuscode: 200, data: { seller } };
  }

  async remove(id: number): Promise<object> {
    const seller = await this.sellerModel.destroy({ where: { id } });
    return { statuscode: 200, data: {} };
  }
}
