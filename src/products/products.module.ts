import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { products } from './models/product.model';

@Module({
  imports: [SequelizeModule.forFeature([products])],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
