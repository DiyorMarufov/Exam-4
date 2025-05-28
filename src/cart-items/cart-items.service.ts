import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { InjectModel } from '@nestjs/sequelize';
import { CartItems } from './models/cart-item.model';
import { catchError } from '../utils/error-catch';

@Injectable()
export class CartItemsService {
  constructor(@InjectModel(CartItems) private model: typeof CartItems) {}
  async create(createCartItemDto: CreateCartItemDto) {
    try {
      const newCartItems = await this.model.create({ ...createCartItemDto });
      return {
        statusCode: 201,
        message: 'success',
        data: newCartItems,
      };
    } catch (e) {
      return catchError(e);
    }
  }

  async findAll() {
    try {
      return {
        statusCode: 200,
        message: 'success',
        data: await this.model.findAll(),
      };
    } catch (e) {
      return catchError(e);
    }
  }

  async findOne(id: number) {
    try {
      const cartItem = await this.model.findByPk(id);

      if (!cartItem) {
        throw new NotFoundException(`CartItem with ID ${id} not found`);
      }
      return {
        statusCode: 200,
        message: 'success',
        data: cartItem,
      };
    } catch (e) {
      return catchError(e);
    }
  }

  async update(id: number, updateCartItemDto: UpdateCartItemDto) {
    try {
      const [count, rows] = await this.model.update(updateCartItemDto, {
        where: { id },
        returning: true,
      });

      if (count === 0) {
        throw new BadRequestException(
          `UpdatedCartItem not found or not updated`,
        );
      }

      return {
        statusCode: 200,
        message: 'success',
        data: rows[0],
      };
    } catch (e) {
      return catchError(e);
    }
  }

  async remove(id: number) {
    try {
      const count = await this.model.destroy({ where: { id } });

      if (count === 0) {
        throw new BadRequestException(`Data not deleted or not found`);
      }

      return {
        statusCode: 200,
        message: 'success',
        data: {},
      };
    } catch (e) {
      return catchError(e);
    }
  }
}
