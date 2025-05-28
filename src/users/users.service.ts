import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../users/models/user.model';
import { Cart } from '../carts/models/cart.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userModel: typeof User,
    @InjectModel(Cart) private cartModel: typeof Cart,
  ) {}
  async create(createUserDto: CreateUserDto) {
    try {
      const newUser = await this.userModel.create({ ...createUserDto });
      await this.cartModel.create({ buyer_id: newUser.id });

      return newUser;
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  async findAll() {
    try {
      return this.userModel.findAll();
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  async findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
