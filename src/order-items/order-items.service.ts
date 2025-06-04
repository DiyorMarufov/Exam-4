import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { InjectModel } from '@nestjs/sequelize';
import { OrderItems } from './models/order-item.model';
import { catchError } from '../utils/error-catch';
import { successRes } from '../utils/success-response';

@Injectable()
export class OrderItemsService {
  constructor(@InjectModel(OrderItems) private model: typeof OrderItems) {}
  async create(createOrderItemDto: CreateOrderItemDto): Promise<Object> {
    return 'This action adds a new orderItem';
  }

  async findAll(): Promise<Object> {
    try {
      return successRes(await this.model.findAll());
    } catch (e) {
      return catchError(e);
    }
  }

  async findOne(id: number): Promise<Object> {
    try {
      const orderItem = await this.model.findByPk(id);

      if (!orderItem) {
        throw new NotFoundException(`OrderItem with ID ${id} not found`);
      }

      return successRes(orderItem);
    } catch (e) {
      return catchError(e);
    }
  }

  async update(
    id: number,
    updateOrderItemDto: UpdateOrderItemDto,
  ): Promise<Object> {
    return `This action updates a #${id} orderItem`;
  }

  async remove(id: number): Promise<Object> {
    return `This action removes a #${id} orderItem`;
  }
}
