import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Orders } from './models/order.model';
import { Carts } from '../carts/models/cart.model';
import { OrderItems } from '../order-items/models/order-item.model';
import { CartItems } from '../cart-items/models/cart-item.model';
import { catchError } from '../utils/error-catch';
import { successRes } from '../utils/success-response';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Orders) private orderModel: typeof Orders,
    @InjectModel(Carts) private cartModel: typeof Carts,
    @InjectModel(OrderItems) private orderItemModel: typeof OrderItems,
    @InjectModel(CartItems) private cartItemModel: typeof CartItems,
  ) {}
  async createOrderFromCart(createOrderDto: CreateOrderDto): Promise<Object> {
    try {
      const { buyer_id, cart_item_id } = createOrderDto;

      const cart = await this.cartModel.findOne({
        where: { buyer_id },
        include: [CartItems],
      });

      if (!cart || !cart.dataValues.items.length) {
        throw new NotFoundException(`Cart is empty`);
      }

      const selectedItems = cart.dataValues.items.filter((item: any) =>
        cart_item_id.includes(item.dataValues.id),
      );

      if (!selectedItems.length) {
        throw new NotFoundException(`No matching cart items found`);
      }

      const newOrder = await this.orderModel.create({
        ...createOrderDto,
        order_status: 'pending',
      });

      const newOrderItems = selectedItems.map((item: any) => ({
        order_id: newOrder.id,
        product_id: item.dataValues.product_id,
        quantity: item.dataValues.quantity,
        price: item.dataValues.price,
      }));

      await this.orderItemModel.bulkCreate(newOrderItems);

      await this.cartItemModel.destroy({
        where: { id: cart_item_id },
      });

      return successRes(newOrder, 201);
    } catch (e) {
      return catchError(e);
    }
  }

  async findAll(): Promise<Object> {
    try {
      return successRes(await this.orderModel.findAll());
    } catch (e) {
      return catchError(e);
    }
  }

  async findOne(id: number): Promise<Object> {
    try {
      const order = await this.orderModel.findByPk(id);
      if (!order) {
        throw new NotFoundException(`Order with ID ${id} not found`);
      }

      return successRes(order);
    } catch (e) {
      return catchError(e);
    }
  }

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Object> {
    try {
      const [count, rows] = await this.orderModel.update(updateOrderDto, {
        where: { id },
        returning: true,
      });

      if (count === 0) {
        throw new BadRequestException(
          `Data with ID ${id} not found or not updated`,
        );
      }

      return successRes(rows[0]);
    } catch (e) {
      return catchError(e);
    }
  }

  async remove(id: number): Promise<Object> {
    try {
      const count = await this.orderModel.destroy({ where: { id } });

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
