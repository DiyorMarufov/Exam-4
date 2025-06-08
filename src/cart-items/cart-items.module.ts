import { Module } from '@nestjs/common';
import { CartItemsService } from './cart-items.service';
import { CartItemsController } from './cart-items.controller';
import { CartItems } from './models/cart-item.model';
import { SequelizeModule } from '@nestjs/sequelize';


@Module({
  imports: [SequelizeModule.forFeature([CartItems])],
  controllers: [CartItemsController],
  providers: [CartItemsService],
})
export class CartItemsModule {}
