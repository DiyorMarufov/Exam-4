import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { products } from './models/product.model';
import { FileModule } from '../file/file.module';

@Module({
  imports: [SequelizeModule.forFeature([products]), FileModule],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
