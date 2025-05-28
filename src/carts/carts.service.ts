import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Cart } from '../carts/models/cart.model';

@Injectable()
export class CartsService {
  constructor(@InjectModel(Cart) private model: typeof Cart) {}
  async create(createCartDto: CreateCartDto) {
    try {
      const newCart = await this.model.create({ ...createCartDto });
      return newCart;
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
    try {
      const user = await this.model.findByPk(id);
      if (!user) {
        throw new NotFoundException(`Cart not found`);
      }

      return user;
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  async update(id: number, updateCartDto: UpdateCartDto) {
    const [count, rows] = await this.model.update(updateCartDto, {
      where: { id },
      returning: true,
    });

    if (count === 0) {
      throw new NotFoundException(`Updated cart not found`);
    }
    return rows[0];
  }

  async remove(id: number) {
    try {
      const count = await this.model.destroy({ where: { id } });
      if (count === 0) {
        throw new BadRequestException(`Error in deleting cart`);
      }
      return {
        data: {},
      };
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }
}
