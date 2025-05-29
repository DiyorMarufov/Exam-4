import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Customer } from './model/customer.model';
import { Roles } from 'src/ENUM';
import { UserSingInDto } from './dto/user-signIn-dto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class CustomerService {
  constructor(
    @InjectModel(Customer) private readonly customerModel: typeof Customer,
  ) {}

  async signUp(createCustomerDto: CreateCustomerDto) {
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
      const hashedPassword = await bcrypt.hash(password, 10);
      const newCustomer = await this.customerModel.create({
        ...createCustomerDto,
        role: Roles.CUSTOMER,
        hashedPassword,
      });
      return newCustomer;
    } catch (error) {
      return error.message;
    }
  }

  async singIn(userSingInDto: UserSingInDto) {
    const singInUser = {}; // token va boshqalarni yozman
  }

  async findAll() {
    try {
      const allUser = await this.customerModel.findAll();
      return { statusCode: 200, data: allUser };
    } catch (error) {
      return error.message;
    }
  }

  async findOne(id: number) {
    try {
      const user = await this.customerModel.findByPk(id);
      if (!user) {
        throw new Error('User not found');
      }
      return { statusCode: 200, data: user };
    } catch (error) {
      return error.message;
    }
  }

  async update(id: number, updateCustomerDto: UpdateCustomerDto) {
    try {
      const updatedProduct = await this.customerModel.update(
        updateCustomerDto,
        { where: { id }, returning: true },
      );
      return { statuscode: 200, data: updatedProduct[1][0] };
    } catch (error) {
      return error.message;
    }
  }

  async remove(id: number) {
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
      return error.message;
    }
  }
}
