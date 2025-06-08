import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Customer } from './model/customer.model';
import { Roles } from 'src/enums';
import { UserSignInDto } from './dto/user-signIn-dto';
import { ConfirmSignInCustomerDto } from './dto/confirm-signin-customer.dto';
import { EmailToRecoverPassCustomerDto } from './dto/email-toRecoverPassword.dto';
import { VerifyPasswordCustomerDto } from './dto/verify-password-customer.dto';
import { encrypt, decrypt } from 'src/utils/encrypt-decrypt';
import { catchError } from '../utils/error-catch';
import { successRes } from '../utils/success-response';
import { TokenService } from 'src/utils/generate-token';
import { writeToCookie } from 'src/utils/write-cookie';
import { Response } from 'express';
import { generateOTP } from '../utils/otp-generator';
import { MailService } from '../mail/mail.service';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Carts } from '../carts/models/cart.model';

@Injectable()
export class CustomerService {
  constructor(
    @InjectModel(Customer) private readonly customerModel: typeof Customer,
    @InjectModel(Carts) private readonly cartsModel: typeof Carts,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly tokenService: TokenService,
    private readonly mailService: MailService,
  ) {}

  async signUp(
    createCustomerDto: CreateCustomerDto,
  ): Promise<object | undefined> {
    try {
      const existingEmail = await this.customerModel.findOne({
        where: { email: createCustomerDto.email },
      });
      const existingPhone = await this.customerModel.findOne({
        where: { phone: createCustomerDto.phone },
      });
      if (existingEmail) {
        throw new BadRequestException('Email already exists');
      }
      if (existingPhone) {
        throw new BadRequestException('Phone number already exists');
      }
      const { password } = createCustomerDto;
      const hashed_password = await encrypt(password);
      const newCustomer = await this.customerModel.create({
        ...createCustomerDto,
        role: Roles.CUSTOMER,
        hashed_password,
      });

      await this.cartsModel.create({
        buyer_id: newCustomer.id,
      });

      return successRes(
        {
          full_name: newCustomer.dataValues.full_name,
          email: newCustomer.dataValues.email,
          phone: newCustomer.dataValues.phone,
          address: newCustomer.dataValues.address,
        },
        201,
      );
    } catch (error) {
      return catchError(error);
    }
  }

  async signIn({
    userSignInDto,
  }: {
    userSignInDto: UserSignInDto;
  }): Promise<object | undefined> {
    try {
      const { email, password } = userSignInDto;
      const customer = await this.customerModel.findOne({ where: { email } });
      if (!customer) {
        throw new BadRequestException('Email or password incorrect');
      }
      const { hashed_password } = customer?.dataValues;
      const isMatchPassword = await decrypt(password, hashed_password);
      if (!isMatchPassword) {
        throw new BadRequestException('Email or password incorrect');
      }

      const otp = generateOTP();
      await this.mailService.sendOtp(
        email,
        'Welcome to online marketplace',
        otp,
      );
      await this.cacheManager.set(email, otp, 120000);
      return successRes(email);
    } catch (error) {
      return catchError(error);
    }
  }

  async confirmSignIn(
    confirmSignInCustomerDto: ConfirmSignInCustomerDto,
    res: Response,
  ): Promise<object | undefined> {
    try {
      const { email, otp } = confirmSignInCustomerDto;

      const customer = await this.customerModel.findOne({ where: { email } });
      if (!customer) {
        throw new BadRequestException(
          `Customer with email ${email} does not exist`,
        );
      }

      const hasCustomer = await this.cacheManager.get(email);

      if (!hasCustomer || hasCustomer !== otp) {
        throw new BadRequestException(`Incorrect or expired otp`);
      }

      const { id, role } = customer?.dataValues;
      const payload = {
        id,
        role,
      };
      const accessToken = await this.tokenService.generateAccessToken(payload);
      const refreshToken =
        await this.tokenService.generateRefreshToken(payload);
      writeToCookie(res, 'refreshTokenCustomer', refreshToken);
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

      const customer = await this.customerModel.findByPk(decodedToken.id);
      if (!customer) {
        throw new NotFoundException(
          `Customer with ID ${decodedToken.id} not found`,
        );
      }

      const { id, role } = customer?.dataValues;
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

      const customer = await this.customerModel.findByPk(decodedToken.id);
      if (!customer) {
        throw new NotFoundException(
          `Customer with ID ${decodedToken.id} not found`,
        );
      }

      res.clearCookie(`refreshTokenCustomer`);
      return successRes(`Customer signed out successfully`);
    } catch (e) {
      return catchError(e);
    }
  }

  async sendOtpToVerifyCustomer(
    passwordRecoveryDto: EmailToRecoverPassCustomerDto,
  ) {
    try {
      const { email } = passwordRecoveryDto;
      const existsCustomer = await this.customerModel.findOne({
        where: { email },
      });
      if (!existsCustomer) {
        throw new NotFoundException(`Cutsomer with email ${email} not found`);
      }

      const otp = generateOTP();
      await this.mailService.sendOtp(
        email,
        'Verify to recover your password',
        otp,
      );
      await this.cacheManager.set(email, otp);
      return successRes(`Otp sent to ${email},Please verify your email`);
    } catch (e) {
      return catchError(e);
    }
  }

  async verifyUserToRecoverPass(
    verifyUserToRecoverPass: ConfirmSignInCustomerDto,
  ) {
    try {
      const { email, otp } = verifyUserToRecoverPass;

      const customer = await this.customerModel.findOne({ where: { email } });
      if (!customer) {
        throw new NotFoundException(`Customer with email ${email} not found`);
      }

      const hasCustomer = await this.cacheManager.get(email);
      if (!hasCustomer || hasCustomer !== otp) {
        throw new BadRequestException(`Incorrect or expired otp`);
      }

      await this.mailService.sendOtp(
        email,
        `Please go to the link below to reset your password`,
        `http://localhost:4000/customer/recovery-password`,
      );
      return successRes(`Message sent to the email ${email}`);
    } catch (e) {
      return catchError(e);
    }
  }

  async recoverPassCustomer(
    verifyPasswordCustomerDto: VerifyPasswordCustomerDto,
  ) {
    try {
      const { email, password, confirmPassword } = verifyPasswordCustomerDto;

      const customer = await this.customerModel.findOne({ where: { email } });
      if (!customer) {
        throw new NotFoundException(`Customer not found with email ${email}`);
      }

      if (password !== confirmPassword) {
        throw new BadRequestException(
          `Password should match with confirm password`,
        );
      }

      const hashed_password = await encrypt(password);
      await this.customerModel.update(
        { hashed_password },
        {
          where: { email },
          returning: true,
        },
      );
      return successRes(`Your password has been successfully recovered`);
    } catch (e) {
      return catchError(e);
    }
  }

  async findAll(): Promise<object | undefined> {
    try {
      const customers = await this.customerModel.findAll({
        include: { all: true },
      });
      return successRes(customers);
    } catch (error) {
      return catchError(error);
    }
  }

  async findOne(id: number): Promise<object | undefined> {
    try {
      const user = await this.customerModel.findByPk(id, {
        include: { all: true },
      });
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return successRes(user);
    } catch (error) {
      return catchError(error);
    }
  }

  async update(
    id: number,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<object | undefined> {
    try {
      const [count, rows] = await this.customerModel.update(updateCustomerDto, {
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
      const count = await this.customerModel.destroy({ where: { id } });
      if (!count) {
        throw new Error(`Data with ID ${id} not found or not deleted`);
      }
      return successRes();
    } catch (error) {
      return catchError(error);
    }
  }
}
