import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Orders } from './models/order.model';
import { CartItems } from '../cart-items/models/cart-item.model';
import { Carts } from '../carts/models/cart.model';
import { OrderItems } from '../order-items/models/order-item.model';

@Module({
  imports: [SequelizeModule.forFeature([Orders, OrderItems, CartItems, Carts])],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
