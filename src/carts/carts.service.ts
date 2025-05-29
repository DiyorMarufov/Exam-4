import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Carts } from '../carts/models/cart.model';
import { catchError } from '../utils/error-catch';

@Injectable()
export class CartsService {
  constructor(@InjectModel(Carts) private model: typeof Carts) {}

  async findAll() {
    try {
      const carts = await this.model.findAll();
      return carts;
    } catch (err) {
      return catchError(err);
    }
  }

  async findOne(id: number) {
    try {
      const cart = await this.model.findByPk(id);

      if (!cart) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return cart;
    } catch (err) {
      return catchError(err);
    }
  }
}
