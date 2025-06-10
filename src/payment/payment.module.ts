import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Payment } from './model/payment.model';
import { Orders } from '../orders/models/order.model';
import { OrderItems } from '../order-items/models/order-item.model';
import { products } from '../products/models/product.model';

@Module({
  imports: [
    SequelizeModule.forFeature([Payment, Orders, OrderItems, products]),
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
