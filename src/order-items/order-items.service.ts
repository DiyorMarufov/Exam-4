import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { InjectModel } from '@nestjs/sequelize';
import { OrderItems } from './models/order-item.model';
import { catchError } from '../utils/error-catch';
import { successRes } from '../utils/success-response';
import { Orders } from '../orders/models/order.model';

@Injectable()
export class OrderItemsService {
  constructor(@InjectModel(OrderItems) private model: typeof OrderItems) {}
  async create(createOrderItemDto: CreateOrderItemDto): Promise<Object> {
    return 'This action adds a new orderItem';
  }

  async findAll(): Promise<Object> {
    try {
      const orderItems = await this.model.findAll({ include: { all: true } });
      return successRes(orderItems);
    } catch (e) {
      return catchError(e);
    }
  }

  async findAllForCustomer(req: any): Promise<Object> {
    try {
      const orderItems = await this.model.findAll({
        include: { model: Orders, where: { buyer_id: req.user.id } },
      });

      if (!orderItems) {
        throw new ForbiddenException(`You are not the owner of this product`);
      }
      return successRes(orderItems);
    } catch (e) {
      return catchError(e);
    }
  }

  async findOne(id: number): Promise<Object> {
    try {
      const orderItem = await this.model.findByPk(id, {
        include: { all: true },
      });

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
