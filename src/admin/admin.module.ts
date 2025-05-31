import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TokenService } from 'src/utils/generate-token';
import { SequelizeModule } from '@nestjs/sequelize';
import { Admin } from './model/admin.model';

@Module({
  imports: [SequelizeModule.forFeature([Admin])],
  controllers: [AdminController],
  providers: [AdminService, TokenService],
})
export class AdminModule {}
