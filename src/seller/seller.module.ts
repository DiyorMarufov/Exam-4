import { Module } from '@nestjs/common';
import { SellerService } from './seller.service';
import { SellerController } from './seller.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Seller } from './model/seller.model';
import { TokenService } from 'src/utils/generate-token';

@Module({
  imports: [SequelizeModule.forFeature([Seller])],
  controllers: [SellerController],
  providers: [SellerService, TokenService],
})
export class SellerModule {}
