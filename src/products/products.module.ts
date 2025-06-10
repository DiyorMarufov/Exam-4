import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { products } from './models/product.model';
import { productsImage } from './models/products.images.model';
import { FileModule } from 'src/file/file.module';

@Module({
  imports: [SequelizeModule.forFeature([products, productsImage]), FileModule],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
