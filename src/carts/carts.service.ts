import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Carts } from '../carts/models/cart.model';
import { catchError } from '../utils/error-catch';

@Injectable()
export class CartsService {
  constructor(@InjectModel(Carts) private model: typeof Carts) {}

  async findAll(): Promise<Object> {
    try {
      const carts = await this.model.findAll({ include: { all: true } });
      return carts;
    } catch (err) {
      return catchError(err);
    }
  }

  async findOne(id: number): Promise<Object> {
    try {
      const cart = await this.model.findByPk(id, { include: { all: true } });

      if (!cart) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return cart;
    } catch (err) {
      return catchError(err);
    }
  }
}
