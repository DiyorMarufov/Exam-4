import { Module } from '@nestjs/common';
import { OrderItemsService } from './order-items.service';
import { OrderItemsController } from './order-items.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { OrderItems } from './models/order-item.model';

@Module({
  imports: [SequelizeModule.forFeature([OrderItems])],
  controllers: [OrderItemsController],
  providers: [OrderItemsService],
})
export class OrderItemsModule {}
