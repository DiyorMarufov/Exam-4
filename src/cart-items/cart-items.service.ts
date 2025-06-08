import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
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

  async findAllCartItems(): Promise<Object> {
    try {
      const cartItems = await this.model.findAll({ include: { all: true } });
      return successRes(cartItems);
    } catch (e) {
      return catchError(e);
    }
  }

  async findAll(req: any) {
    try {
      
      const cartItems = await this.model.findAll({
        where: { cart_id: req.user.id },
        include: { all: true },
      });

      return successRes(cartItems);
    } catch (e) {
      return catchError(e);
    }
  }

  async findOne(id: number, req: any): Promise<Object> {
    try {
      const cartItem = await this.model.findByPk(id);
      
      if (!cartItem) {
        throw new NotFoundException(`Cart Item with ID ${id} not found`);
      }

      if (cartItem.dataValues.cart_id !== req.user.id) {
        throw new ForbiddenException(`This cart item does not belong to you`);
      }

      return successRes(cartItem);
    } catch (e) {
      return catchError(e);
    }
  }

  async update(
    id: number,
    updateCartItemDto: UpdateCartItemDto,
    req: any,
  ): Promise<Object> {
    try {
      const cartItem = await this.model.findByPk(id);

      if (!cartItem) {
        throw new NotFoundException(`Cart item with ID ${id} not found`);
      }

      if (cartItem.dataValues.cart_id !== req.user.id) {
        throw new ForbiddenException(`This cart item does not belong to you`);
      }

      const updated = await cartItem.update(updateCartItemDto);

      return successRes(updated);
    } catch (e) {
      return catchError(e);
    }
  }

  async remove(id: number, req: any): Promise<Object> {
    try {
      const cartItem = await this.model.findByPk(id);

      if (!cartItem) {
        throw new NotFoundException(`Cart item with ID ${id} not found`);
      }

      if (cartItem.dataValues.cart_id !== req.user.id) {
        throw new ForbiddenException(`This cart item does not belong to you`);
      }

      await cartItem.destroy()

      return successRes();
    } catch (e) {
      return catchError(e);
    }
  }
}
