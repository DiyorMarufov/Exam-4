import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { products } from './models/product.model';
import { FileModule } from '../file/file.module';
import { Seller } from '../seller/model/seller.model';
import { categories } from '../categories/models/category.model';

@Module({
  imports: [
    SequelizeModule.forFeature([products, Seller, categories]),
    FileModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
