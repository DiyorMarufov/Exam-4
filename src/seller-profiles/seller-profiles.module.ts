import { Module } from '@nestjs/common';
import { SellerProfilesDbService } from './seller-profiles.service';
import { SellerProfilesController } from './seller-profiles.controller';
import { SellerProfile } from './model/seller-profile.model';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [SequelizeModule.forFeature([SellerProfile])],
  controllers: [SellerProfilesController],
  providers: [SellerProfilesDbService],
})
export class SellerProfilesModule {}
