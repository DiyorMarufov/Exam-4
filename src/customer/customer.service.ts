import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Customer } from './model/customer.model';
import { Roles } from 'src/enums';
import { UserSignInDto } from './dto/user-signIn-dto';
import * as bcrypt from 'bcrypt';
import { encrypt, decrypt } from 'src/utils/encrypt-decrypt';
import { catchError } from '../utils/error-catch';
import { successRes } from '../utils/success-response';
import { TokenService } from 'src/utils/generate-token';
import { writeToCookie } from 'src/utils/write-cookie';
import { Response } from 'express';

@Injectable()
export class CustomerService {
  constructor(
    @InjectModel(Customer) private readonly customerModel: typeof Customer,
    private readonly tokenService: TokenService,
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
      return successRes(newCustomer);
    } catch (error) {
      return catchError(error);
    }
  }

  async signIn({
    userSignInDto,
    res,
  }: {
    userSignInDto: UserSignInDto;
    res: Response;
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
      const payload = {
        id: customer.id,
        role: customer.role,
        email: customer.email,
      };
      const accessToken = await this.tokenService.generateAccessToken(payload);
      const refreshToken =
        await this.tokenService.generateRefreshToken(payload);
      writeToCookie(res, 'refreshTokenCustomer', refreshToken);
      return successRes(accessToken);
    } catch (error) {
      return catchError(error);
    }
  }

  async findAll(): Promise<object | undefined> {
    try {
      return successRes(await this.customerModel.findAll());
    } catch (error) {
      return catchError(error);
    }
  }

  async findOne(id: number): Promise<object | undefined> {
    try {
      const user = await this.customerModel.findByPk(id);
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
