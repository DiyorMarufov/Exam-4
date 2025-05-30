import { Module } from '@nestjs/common';
import { AdminService } from './admins.service';
import { AdminController } from './admins.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Admin } from './models/admin.model';
import { TokenService } from '../utils/generate-token';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [SequelizeModule.forFeature([Admin]), MailModule],
  controllers: [AdminController],
  providers: [AdminService, TokenService],
})
export class AdminsModule {}
