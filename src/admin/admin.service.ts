import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Admin } from './model/admin.model';
import { decrypt, encrypt } from 'src/utils/encrypt-decrypt';
import { Roles } from 'src/enums';
import { catchError } from 'src/utils/catch-error';
import { SignInAdminDto } from './dto/sign-in-admin.dto';
import { TokenService } from 'src/utils/generate-token';
import { writeToCookie } from 'src/utils/write-cookie';
import { Response } from 'express';

@Injectable()
export class AdminService implements OnModuleInit {
  constructor(
    @InjectModel(Admin) private adminModel: typeof Admin,
    private readonly token: TokenService,
  ) {}

  async onModuleInit(): Promise<void> {
    try {
      const isSuperAdmin = await this.adminModel.findOne({
        where: { role: Roles.SUPERADMIN },
      });
      if (!isSuperAdmin) {
        const hashedPassword = await encrypt(String(process.env.ADMIN_PASSWORD));
        await this.adminModel.create({
          name: process.env.ADMIN_FULL_NAME,
          email: process.env.ADMIN_EMAIL,
          phone: process.env.ADMIN_PHONE,
          hashed_password: hashedPassword,
          role: Roles.SUPERADMIN,
        });
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async createAdmin(createAdminDto: CreateAdminDto): Promise<object> {
    try {
      const { email, phone, password } = createAdminDto;
      const existsEmail = await this.adminModel.findOne({ where: { email } });
      if (existsEmail) {
        throw new ConflictException(`Email address already exists -> ${email}`);
      }
      const existsPhone = await this.adminModel.findOne({
        where: { phone },
      });
      if (existsPhone) {
        throw new ConflictException(`Phone number already exists -> ${phone}`);
      }
      const hashedPassword = await encrypt(password);
      const admin = await this.adminModel.create({
        ...createAdminDto,
        hashed_password: hashedPassword,
      });
      return {
        statusCode: 201,
        message: 'success',
        data: admin,
      };
    } catch (error) {
      return catchError(error);
    }
  }

  async signInAdmin(
    signInAdminDto: SignInAdminDto,
    res: Response,
  ): Promise<object> {
    try {
      const { email, password } = signInAdminDto;
      const admin = await this.adminModel.findOne({ where: { email } });
      if (!admin) {
        throw new BadRequestException('Email or password incorrect');
      }
      const { hashed_password } = admin?.dataValues;
      const isMatchPassword = await decrypt(password, hashed_password);
      if (!isMatchPassword) {
        throw new BadRequestException('Email or password incorrect');
      }
      const payload = { id: admin.id, status: admin.status, role: admin.role };
      const accessToken = await this.token.generateAccessToken(payload);
      const refreshToken = await this.token.generateRefreshToken(payload);
      writeToCookie(res, 'refreshTokenAdmin', refreshToken);
      return {
        statusCode: 200,
        message: 'success',
        data: accessToken,
      };
    } catch (error) {
      return catchError(error);
    }
  }
}
