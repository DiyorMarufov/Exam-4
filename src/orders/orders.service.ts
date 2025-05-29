import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Orders } from './models/order.model';
import { Carts } from '../carts/models/cart.model';
import { OrderItems } from '../order-items/models/order-item.model';
import { CartItems } from '../cart-items/models/cart-item.model';
import { catchError } from '../utils/error-catch';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Orders) private orderModel: typeof Orders,
    @InjectModel(Carts) private cartModel: typeof Carts,
    @InjectModel(OrderItems) private orderItemModel: typeof OrderItems,
    @InjectModel(CartItems) private cartItemModel: typeof CartItems,
  ) {}
  async createOrderFromCart(createOrderDto: CreateOrderDto) {
    try {
      
      const cart = await this.cartModel.findOne({
        where: { buyer_id: createOrderDto.buyer_id },
        include: [CartItems],
      });
      
      
      if (!cart || !cart.dataValues.items.length) {
        throw new NotFoundException(`Cart is empty`);
      }

      const newOrder = await this.orderModel.create({
        ...createOrderDto,
        order_status: 'pending',
      });
      
      const newOrderItems = cart.dataValues.items.map((item: any) => {
        return {
          order_id: newOrder.id,
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price,
        };
      });
      console.log(newOrderItems)
      return {
         message: 'success'
      }
      // await this.orderItemModel.bulkCreate(newOrderItems);

      // await this.cartModel.destroy({
      //   where: { buyer_id: createOrderDto.buyer_id },
      // });

      // await this.cartItemModel.destroy({
      //   where: { cart_id: cart.id },
      // });

      // return {
      //   statusCode: 201,
      //   message: 'success',
      //   data: newOrder,
      // };
    } catch (e) {
      return catchError(e);
    }
  }

  async findAll() {
    return {
      statusCode: 200,
      message: 'success',
      data: await this.orderModel.findAll(),
    };
  }

  async findOne(id: number) {
    const order = await this.orderModel.findByPk(id);
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return {
      statusCode: 200,
      message: 'success',
      data: order,
    };
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  async remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
