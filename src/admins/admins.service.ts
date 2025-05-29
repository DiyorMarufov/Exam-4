import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Admin } from './models/admin.model';
import { decrypt, encrypt } from 'src/utils/encrypt-decrypt';
import { Roles } from '../enums/admin';
import { catchError } from '../utils/error-catch';
import { SignInAdminDto } from './dto/signin-admin.dto';
import { TokenService } from 'src/utils/generate-token';

@Injectable()
export class AdminService implements OnModuleInit {
  constructor(
    @InjectModel(Admin) private adminModel: typeof Admin,
    private readonly tokenService: TokenService,
  ) {}

  async onModuleInit(): Promise<void> {
    try {
      const isSuperAdmin = await this.adminModel.findOne({
        where: { role: Roles.SUPERADMIN },
      });
      if (!isSuperAdmin) {
        const hashedPassword = await encrypt(
          String(process.env.ADMIN_PASSWORD),
        );
        await this.adminModel.create({
          full_name: process.env.ADMIN_FULL_NAME,
          email: process.env.ADMIN_EMAIL,
          phone_number: process.env.ADMIN_PHONE,
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
      const { email, phone_number, password } = createAdminDto;
      const existsEmail = await this.adminModel.findOne({ where: { email } });
      if (existsEmail) {
        throw new ConflictException(`Email address already exists -> ${email}`);
      }
      const existsPhone = await this.adminModel.findOne({
        where: { phone_number },
      });
      if (existsPhone) {
        throw new ConflictException(
          `Phone number already exists -> ${phone_number}`,
        );
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

  async signInAdmin(signInAdminDto: SignInAdminDto): Promise<object> {
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

      const { id, role, status } = admin?.dataValues;
      const payload = { id, role, status };
      const accessToken = await this.tokenService.accessToken(payload);
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
