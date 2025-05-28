import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../users/models/user.model';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private model: typeof User) {}
  async create(createUserDto: CreateUserDto) {
    try {
      const newUser = await this.model.create({ ...createUserDto });
      return newUser;
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  async findAll() {
    try {
      return this.model.findAll();
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
