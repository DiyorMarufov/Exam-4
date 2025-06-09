import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Payment } from './model/payment.model';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { catchError } from '../utils/error-catch';
import { successRes } from '../utils/success-response';
import { Orders } from '../orders/models/order.model';
import { OrderItems } from '../order-items/models/order-item.model';
import { products } from '../products/models/product.model';
import { Sequelize } from 'sequelize-typescript';
import { v4 } from 'uuid';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment)
    private paymentModel: typeof Payment,
    @InjectModel(Orders)
    private orderModel: typeof Orders,
    @InjectModel(OrderItems)
    private orderItemModel: typeof OrderItems,
    @InjectModel(products)
    private productModel: typeof products,
    private sequelize: Sequelize,
  ) {}

  async create(createPaymentDto: CreatePaymentDto): Promise<object> {
    const transaction = await this.sequelize.transaction();
    try {
      const { order_id } = createPaymentDto;

      const orderItems = await this.orderItemModel.findAll({
        where: { order_id },
        include: [this.productModel],
        transaction,
      });

      for (const orderItem of orderItems) {
        const { products } = orderItem?.dataValues;
        const product = products.dataValues;
        const item = orderItem?.dataValues;

        if (!product) {
          throw new NotFoundException(
            `Product with ID ${item.product_id} not found`,
          );
        }

        if (product.quantity < item.quantity) {
          throw new BadRequestException(
            `Not enough stock for product with ID ${item.product_id}`,
          );
        }
        await this.productModel.update(
          {
            quantity: product.quantity - item.quantity,
          },
          { where: { id: product.id }, transaction },
        );
      }

      await this.orderModel.update(
        {
          order_status: `shipped`,
        },
        { where: { id: order_id }, transaction },
      );

      const receipt_number = v4();

      const newPayment = await this.paymentModel.create({
        ...createPaymentDto,
        receipt_number,
        transaction
      });
      await transaction.commit();

      return successRes(newPayment);
    } catch (error) {
      await transaction.rollback();
      return catchError(error);
    }
  }

  async findAll(): Promise<object | undefined> {
    try {
      const payments = await this.paymentModel.findAll({
        include: { all: true },
      });
      return successRes(payments);
    } catch (error) {
      return catchError(error);
    }
  }

  async findAllForCustomer(req: any): Promise<object | undefined> {
    try {
      const payments = await this.paymentModel.findAll({
        include: { model: Orders, where: { buyer_id: req.user.id } },
      });

      if (!payments) {
        throw new ForbiddenException(`You are not the owner of this payment`);
      }
      return successRes(payments);
    } catch (error) {
      return catchError(error);
    }
  }

  async findOne(id: number): Promise<object | undefined> {
    try {
      const payment = await this.paymentModel.findByPk(id, {
        include: { all: true },
      });
      if (!payment) {
        throw new NotFoundException(`Payment with ID ${id} not found`);
      }

      return successRes(payment);
    } catch (error) {
      return catchError(error);
    }
  }

  async update(
    id: number,
    updatePaymentDto: UpdatePaymentDto,
  ): Promise<object | undefined> {
    try {
      const [count, rows] = await this.paymentModel.update(updatePaymentDto, {
        where: { id },
        returning: true,
      });
      if (!count) {
        throw new BadRequestException(
          `Data with ID ${id} not found or not updated`,
        );
      }
      return successRes(rows[0]);
    } catch (error) {
      return catchError(error);
    }
  }

  async remove(id: number): Promise<object | undefined> {
    try {
      const count = await this.paymentModel.destroy({ where: { id } });
      if (!count) {
        throw new BadRequestException(
          `Data with ID ${id} not found or not deleted`,
        );
      }

      return successRes();
    } catch (error) {
      return catchError(error);
    }
  }
}
