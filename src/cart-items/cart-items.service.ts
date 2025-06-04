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
import { successRes } from '../utils/success-response';

@Injectable()
export class CartItemsService {
  constructor(@InjectModel(CartItems) private model: typeof CartItems) {}
  async create(createCartItemDto: CreateCartItemDto): Promise<Object> {
    try {
      const newCartItems = await this.model.create({ ...createCartItemDto });
      return successRes(newCartItems, 201);
    } catch (e) {
      return catchError(e);
    }
  }

  async findAll(): Promise<Object> {
    try {
      return successRes(await this.model.findAll({ include: { all: true } }));
    } catch (e) {
      return catchError(e);
    }
  }

  async findOne(id: number): Promise<Object> {
    try {
      const cartItem = await this.model.findByPk(id, {
        include: { all: true },
      });

      if (!cartItem) {
        throw new NotFoundException(`CartItem with ID ${id} not found`);
      }
      return successRes(cartItem);
    } catch (e) {
      return catchError(e);
    }
  }

  async update(
    id: number,
    updateCartItemDto: UpdateCartItemDto,
  ): Promise<Object> {
    try {
      const [count, rows] = await this.model.update(updateCartItemDto, {
        where: { id },
        returning: true,
      });

      if (count === 0) {
        throw new BadRequestException(
          `UpdatedCartItem with ID ${id} not found or not updated`,
        );
      }

      return successRes(rows[0]);
    } catch (e) {
      return catchError(e);
    }
  }

  async remove(id: number): Promise<Object> {
    try {
      const count = await this.model.destroy({ where: { id } });

      if (count === 0) {
        throw new BadRequestException(
          `Data with ID ${id} not deleted or not found`,
        );
      }

      return successRes();
    } catch (e) {
      return catchError(e);
    }
  }
}
