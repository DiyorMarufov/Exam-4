import { Module } from '@nestjs/common';
import { AdminService } from './admins.service';
import { AdminsController } from './admins.controller';
import { Admin } from '../admins/models/admin.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { MailModule } from '../mail/mail.module';
import { TokenService } from '../utils/generate-token';
import { Customer } from '../customer/model/customer.model';

@Module({
  imports: [SequelizeModule.forFeature([Admin, Customer]), MailModule],
  controllers: [AdminsController],
  providers: [AdminService, TokenService],
})
export class AdminsModule {}
