import { Module } from '@nestjs/common';
import { SellerService } from './seller.service';
import { SellerController } from './seller.controller';
import { Seller } from './model/seller.model';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [SequelizeModule.forFeature([Seller])],
  controllers: [SellerController],
  providers: [SellerService],
})
export class SellerModule {}
