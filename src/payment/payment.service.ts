import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Payment } from './model/payment.model';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { catchError } from '../utils/error-catch';
import { successRes } from '../utils/success-response';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment)
    private paymentModel: typeof Payment,
  ) {}

  async create(createPaymentDto: CreatePaymentDto): Promise<object> {
    try {
      const newPayment = await this.paymentModel.create({
        ...createPaymentDto,
      });
      return successRes(newPayment, 201);
    } catch (error) {
      return catchError(error);
    }
  }

  async findAll(): Promise<object | undefined> {
    try {
      return successRes(await this.paymentModel.findAll());
    } catch (error) {
      return catchError(error);
    }
  }

  async findOne(id: number): Promise<object | undefined> {
    try {
      const payment = await this.paymentModel.findByPk(id);
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
