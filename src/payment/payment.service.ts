import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Payment } from './model/payment.model';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { catchError } from '../utils/catch-error';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment)
    private paymentModel: typeof Payment,
  ) {}

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    try {
      return await this.paymentModel.create({ ...createPaymentDto });
    } catch (error) {
      return catchError(error);
    }
  }

  async findAll(): Promise<Payment[] | undefined> {
    try {
      return await this.paymentModel.findAll();
    } catch (error) {
      return catchError(error);
    }
  }

  async findOne(id: number): Promise<Payment | undefined> {
    try {
      const payment = await this.paymentModel.findByPk(id);
      if (!payment) {
        throw new NotFoundException('Bunday ID li payment topilmadi');
      }
      return payment;
    } catch (error) {
      return catchError(error);
    }
  }

  async update(
    id: number,
    updatePaymentDto: UpdatePaymentDto,
  ): Promise<object | undefined> {
    try {
      const updated = await this.paymentModel.update(updatePaymentDto, {
        where: { id },
        returning: true,
      });
      if (!updated[1][0]) {
        throw new NotFoundException('Payment topilmadi yoki yangilanmadi');
      }
      return {
        data: updated[1][0],
        statusCode: 200,
        message: 'Payment muvaffaqiyatli yangilandi',
      };
    } catch (error) {
      return catchError(error);
    }
  }

  async remove(id: number): Promise<object | undefined> {
    try {
      const payment = await this.paymentModel.findOne({ where: { id } });
      if (!payment) {
        throw new NotFoundException('O‘chirish uchun payment topilmadi');
      }
      await this.paymentModel.destroy({ where: { id } });
      return {
        data: {},
        statusCode: 200,
        message: 'Payment muvaffaqiyatli o‘chirildi',
      };
    } catch (error) {
      return catchError(error);
    }
  }
}
