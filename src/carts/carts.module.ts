import { Module } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CartsController } from './carts.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Carts } from './models/cart.model';

@Module({
  imports: [SequelizeModule.forFeature([Carts])],
  controllers: [CartsController],
  providers: [CartsService],
  exports: [SequelizeModule],
})
export class CartsModule {}
