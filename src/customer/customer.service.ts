import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Customer } from './model/customer.model';
import { Roles } from 'src/ENUM';
import { UserSingInDto } from './dto/user-signIn-dto';
import * as bcrypt from 'bcrypt';
import { encrypt } from 'src/utils/encrypt-decrypt';
import { catchError } from '../utils/catch-error';
@Injectable()
export class CustomerService {
  constructor(
    @InjectModel(Customer) private readonly customerModel: typeof Customer,
  ) {}

  async signUp(createCustomerDto: CreateCustomerDto): Promise<object | undefined> {
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
      return newCustomer;
    } catch (error) {
      catchError(error);
    }
  }

  async singIn(userSingInDto: UserSingInDto) {
    const singInUser = {}; // token va boshqalarni yozman  : Promise<object | undefined>
  }

  async findAll(): Promise<object | undefined> {
    try {
      const allUser = await this.customerModel.findAll();
      return { statusCode: 200, data: allUser };
    } catch (error) {
      return catchError(error);
    }
  }

  async findOne(id: number): Promise<object | undefined> {
    try {
      const user = await this.customerModel.findByPk(id);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return { statusCode: 200, data: user };
    } catch (error) {
      catchError(error);
    }
  }

  async update(id: number, updateCustomerDto: UpdateCustomerDto): Promise<object | undefined> {
    try {
      const updatedCustomer = await this.customerModel.update(
        updateCustomerDto,
        { where: { id }, returning: true },
      );
      return { statuscode: 200, data: updatedCustomer[1][0] };
    } catch (error) {
      catchError(error);
    }
  }

  async remove(id: number): Promise<object | undefined> {
    try {
      const deletedUser = await this.customerModel.destroy({ where: { id } });
      if (!deletedUser) {
        throw new Error('Id not found');
      }
      return {
        statusCode: 200,
        data: {},
        message: 'User successfully deleted ✅',
      };
    } catch (error) {
      catchError(error);
    }
  }
}
