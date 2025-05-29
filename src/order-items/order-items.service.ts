import { Injectable } from '@nestjs/common';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { InjectModel } from '@nestjs/sequelize';
import { OrderItems } from './models/order-item.model';
import { catchError } from '../utils/error-catch';

@Injectable()
export class OrderItemsService {
  constructor(@InjectModel(OrderItems) private model: typeof OrderItems) {}
  async create(createOrderItemDto: CreateOrderItemDto) {
    return 'This action adds a new orderItem';
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
    return `This action returns a #${id} orderItem`;
  }

  async update(id: number, updateOrderItemDto: UpdateOrderItemDto) {
    return `This action updates a #${id} orderItem`;
  }

  async remove(id: number) {
    return `This action removes a #${id} orderItem`;
  }
}
