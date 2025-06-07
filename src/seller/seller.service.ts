import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Seller } from './model/seller.model';
import { CreateSellerDto } from './dto/create-seller.dto';
import { ConfirmSignInSellerDto } from './dto/confirm-signin-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';
import { decrypt, encrypt } from 'src/utils/encrypt-decrypt';
import { Roles } from 'src/enums';
import { catchError } from 'src/utils/error-catch';
import { SignInSellerDto } from './dto/sing-in-seller.dto';
import { TokenService } from 'src/utils/generate-token';
import { writeToCookie } from 'src/utils/write-cookie';
import { Response } from 'express';
import { successRes } from '../utils/success-response';
import { generateOTP } from '../utils/otp-generator';
import { MailService } from '../mail/mail.service';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { products } from '../products/models/product.model';

@Injectable()
export class SellerService {
  constructor(
    @InjectModel(Seller)
    private sellerModel: typeof Seller,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly tokenService: TokenService,
    private readonly mailService: MailService,
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
      return successRes(newSeller, 201);
    } catch (error) {
      return catchError(error);
    }
  }

  async signIn({
    signInSellerDto,
  }: {
    signInSellerDto: SignInSellerDto;
  }): Promise<object | undefined> {
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
      const otp = generateOTP();
      await this.mailService.sendOtp(
        email,
        `Welcome to online marketplace`,
        otp,
      );
      await this.cacheManager.set(email, otp, 120000);
      return successRes(email);
    } catch (error) {
      return catchError(error);
    }
  }

  async confirmSignin(confirmSignInDto: ConfirmSignInSellerDto, res: Response) {
    try {
      const { email, otp } = confirmSignInDto;

      const seller = await this.sellerModel.findOne({ where: { email } });
      if (!seller) {
        throw new BadRequestException(
          `Seller with email ${email} does not exist`,
        );
      }

      const hasSeller = await this.cacheManager.get(email);

      if (!hasSeller || hasSeller !== otp) {
        throw new BadRequestException(`Incorrect or expired otp`);
      }

      const { id, role } = seller?.dataValues;
      const payload = {
        id,
        role,
      };
      const accessToken = await this.tokenService.generateAccessToken(payload);
      const refreshToken =
        await this.tokenService.generateRefreshToken(payload);
      writeToCookie(res, 'refreshTokenSeller', refreshToken);
      return successRes(accessToken);
    } catch (e) {
      return catchError(e);
    }
  }

  async refreshToken(refreshToken: string) {
    try {
      const decodedToken =
        await this.tokenService.verifyRefreshToken(refreshToken);

      if (!decodedToken) {
        throw new UnauthorizedException(`Refresh token expired`);
      }
      const seller = await this.sellerModel.findByPk(decodedToken.id);

      if (!seller) {
        throw new NotFoundException(
          `Seller with ID ${decodedToken.id} not found`,
        );
      }

      const { id, role } = seller?.dataValues;
      const payload = {
        id,
        role,
      };
      const accessToken = await this.tokenService.generateAccessToken(payload);
      return successRes(accessToken);
    } catch (e) {
      return catchError(e);
    }
  }

  async signOut(refreshToken: string, res: Response) {
    try {
      const decodedToken =
        await this.tokenService.verifyRefreshToken(refreshToken);

      if (!decodedToken) {
        throw new UnauthorizedException(`Refresh token expired`);
      }

      const seller = await this.sellerModel.findByPk(decodedToken.id);
      if (!seller) {
        throw new NotFoundException(
          `Seller with ID ${decodedToken.id} not found`,
        );
      }

      res.clearCookie(`refreshTokenSeller`);
      return successRes(`Seller signed out successfully`);
    } catch (e) {
      return catchError(e);
    }
  }

  async findAll(): Promise<object | undefined> {
    try {
      const sellers = await this.sellerModel.findAll({
        include: { all: true },
      });
      return successRes(sellers);
    } catch (error) {
      return catchError(error);
    }
  }

  async findOne(id: number): Promise<object | undefined> {
    try {
      const seller = await this.sellerModel.findByPk(id, {
        include: { all: true },
      });
      if (!seller) {
        throw new NotFoundException(`Seller with ID ${id} not found`);
      }

      return successRes(seller);
    } catch (error) {
      return catchError(error);
    }
  }

  async update(
    id: number,
    updateSellerDto: UpdateSellerDto,
  ): Promise<object | undefined> {
    try {
      const [count, rows] = await this.sellerModel.update(updateSellerDto, {
        where: { id },
        returning: true,
      });

      if (!count) {
        throw new BadRequestException(
          `Data with ID ${id} not found or not updated`,
        );
      }

      return successRes(rows[0]);
    } catch (error) {
      return catchError(error);
    }
  }

  async remove(id: number): Promise<object | undefined> {
    try {
      const count = await this.sellerModel.destroy({ where: { id } });
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
