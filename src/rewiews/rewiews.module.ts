import { Module } from '@nestjs/common';
import { RewiewsService } from './rewiews.service';
import { RewiewsController } from './rewiews.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { reviews } from './models/rewiew.models';
import { products } from '../products/models/product.model';
import { SellerProfile } from '../seller-profiles/model/seller-profile.model';

@Module({
  imports: [SequelizeModule.forFeature([reviews, products, SellerProfile])],
  controllers: [RewiewsController],
  providers: [RewiewsService],
})
export class RewiewsModule {}
