import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
  OnModuleInit,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { StatusAdminDto } from './dto/active-deactive-admin.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Admin } from './models/admin.model';
import { decrypt, encrypt } from '../utils/encrypt-decrypt';
import { Roles } from '../enums/index';
import { catchError } from '../utils/error-catch';
import { successRes } from '../utils/success-response';
import { SignInAdminDto } from './dto/signin-admin-dto';
import { ConfirmSignInAdminDto } from './dto/confirm-signin-admin';
import { TokenService } from '../utils/generate-token';
import { generateOTP } from '../utils/otp-generator';
import { MailService } from '../mail/mail.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { writeToCookie } from '../utils/write-cookie';
import { Response } from 'express';
import { Customer } from '../customer/model/customer.model';

@Injectable()
export class AdminService implements OnModuleInit {
  constructor(
    @InjectModel(Admin) private adminModel: typeof Admin,
    @InjectModel(Customer) private customerModel: typeof Customer,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly mailService: MailService,
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
      return catchError(error);
    }
  }

  async signInSuperAdmin(
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

      const { id, role, status } = admin?.dataValues;
      const payload = { id, role, status };
      const accessToken = await this.tokenService.generateAccessToken(payload);
      const refreshToken =
        await this.tokenService.generateRefreshToken(payload);

      writeToCookie(res, 'refreshTokenSuperAdmin', refreshToken);
      return successRes(accessToken);
    } catch (error) {
      return catchError(error);
    }
  }

  async refreshTokenSuperAdmin(refreshToken: string): Promise<object> {
    try {
      const decodedToken =
        await this.tokenService.verifyRefreshToken(refreshToken);

      if (!decodedToken) {
        throw new UnauthorizedException(`Refresh token expired`);
      }

      const admin = await this.adminModel.findByPk(decodedToken.id);
      if (!admin) {
        throw new NotFoundException(
          `Super Admin with ID ${decodedToken.id} not found`,
        );
      }
      const { id, role, status } = admin?.dataValues;

      const payload = { id, role, status };
      const accessToken = await this.tokenService.generateAccessToken(payload);

      return successRes(accessToken);
    } catch (e) {
      return catchError(e);
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
          `Phone number already exists ${phone_number}`,
        );
      }
      const hashedPassword = await encrypt(password);
      const admin = await this.adminModel.create({
        ...createAdminDto,
        hashed_password: hashedPassword,
      });

      return successRes(
        {
          full_name: admin.dataValues.full_name,
          email: admin.dataValues.email,
          phone_number: admin.dataValues.phone_number,
        },
        201,
      );
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

      const otp = generateOTP();
      await this.mailService.sendOtp(
        email,
        'Welcome to onlin marketplace',
        otp,
      );
      await this.cacheManager.set(email, otp, 120000);

      return successRes(email);
    } catch (error) {
      return catchError(error);
    }
  }

  async confirmSigninAdmin(
    confirmSignInDto: ConfirmSignInAdminDto,
    res: Response,
  ): Promise<object> {
    try {
      const { email, otp } = confirmSignInDto;
      const hasUser = await this.cacheManager.get(email);

      if (!hasUser || hasUser !== otp) {
        throw new BadRequestException(`Incorrect or expired otp`);
      }

      const admin = await this.adminModel.findOne({ where: { email } });
      const { id, role, status } = admin?.dataValues;
      const payload = { id, role, status };
      const accessToken = await this.tokenService.generateAccessToken(payload);
      const refreshToken =
        await this.tokenService.generateRefreshToken(payload);

      writeToCookie(res, 'refreshTokenAdmin', refreshToken);
      return successRes(accessToken);
    } catch (e) {
      return catchError(e);
    }
  }

  async refreshTokenAdmin(refreshToken: string): Promise<object> {
    try {
      const decodedToken =
        await this.tokenService.verifyRefreshToken(refreshToken);

      if (!decodedToken) {
        throw new UnauthorizedException(`Refresh token expired`);
      }

      const admin = await this.adminModel.findByPk(decodedToken.id);
      if (!admin) {
        throw new NotFoundException(
          `Admin with ID ${decodedToken.id} not found`,
        );
      }
      const { id, role, status } = admin?.dataValues;

      const payload = { id, role, status };
      const accessToken = await this.tokenService.generateAccessToken(payload);

      return successRes(accessToken);
    } catch (e) {
      return catchError(e);
    }
  }

  async signOutAdmin(refreshToken: string, res: Response): Promise<object> {
    try {
      const decodedToken =
        await this.tokenService.verifyRefreshToken(refreshToken);

      if (!decodedToken) {
        throw new UnauthorizedException(`Refresh token expired`);
      }

      const admin = await this.adminModel.findByPk(decodedToken.id);
      if (!admin) {
        throw new NotFoundException(
          `Admin with ID ${decodedToken.id} not found`,
        );
      }
      res.clearCookie('refreshTokenAdmin');

      return successRes(`Signed out successfully`);
    } catch (e) {
      return catchError(e);
    }
  }

  async getAllAdmins(): Promise<object> {
    try {
      const admins = await this.adminModel.findAll();
      return successRes(admins);
    } catch (e) {
      return catchError(e);
    }
  }

  async getAdminById(id: number): Promise<object> {
    try {
      const admin = await this.adminModel.findByPk(id);
      if (!admin) {
        throw new NotFoundException(`Admin with ID ${id} not found`);
      }
      const { full_name, email, phone_number } = admin?.dataValues;
      return successRes({ full_name, email, phone_number });
    } catch (e) {
      return catchError(e);
    }
  }

  async getActiveCustomers() {
    try {
      const customers = await this.customerModel.findAll({
        include: { all: true },
      });

      let maxOrderCustomer: number = -Infinity;
      let customerId: number = 0;

      for (let item of customers) {
        const order = item.dataValues.order;

        if (order.length > maxOrderCustomer) {
          maxOrderCustomer = order.length;
          customerId = item.id;
        }
      }

      return successRes(
        `Customer with ID ${customerId} has the highest number of orders: ${maxOrderCustomer}`,
      );
    } catch (e) {
      return catchError(e);
    }
  }

  async updateAdmin(
    id: number,
    updateAdminDto: UpdateAdminDto,
  ): Promise<object> {
    try {
      const updatedAdmin: any = { ...updateAdminDto };

      if (updatedAdmin.password) {
        updatedAdmin.hashed_password = await encrypt(updatedAdmin.password);
      }
      delete updatedAdmin.password;

      const [count, rows] = await this.adminModel.update(updatedAdmin, {
        where: { id },
        returning: true,
      });

      if (!count) {
        throw new BadRequestException(
          `Data with ID ${id} not found or not updated`,
        );
      }
      const { full_name, email, phone_number } = rows[0]?.dataValues;
      return successRes({ full_name, email, phone_number });
    } catch (e) {
      return catchError(e);
    }
  }

  async activeDeactiveAdmin(id: number, statusDto: StatusAdminDto) {
    try {
      const admin = await this.adminModel.findByPk(id);
      if (!admin) {
        throw new NotFoundException(`Admin with ID ${id} not found`);
      }
      const updatedAdmin = await this.adminModel.update(
        {
          ...statusDto,
        },
        { where: { id }, returning: true },
      );

      return successRes(updatedAdmin[1][0]);
    } catch (e) {
      return catchError(e);
    }
  }

  async deleteAdmin(id: number): Promise<object> {
    try {
      const count = await this.adminModel.destroy({ where: { id } });

      if (!count) {
        throw new BadRequestException(
          `Data with ID ${id} not found or not deleted`,
        );
      }

      return successRes();
    } catch (e) {
      return catchError(e);
    }
  }
}
