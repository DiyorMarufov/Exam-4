import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Customer } from './model/customer.model';
import { TokenService } from '../utils/generate-token';
import { MailModule } from '../mail/mail.module';
import { CartsModule } from '../carts/carts.module';

@Module({
  imports: [SequelizeModule.forFeature([Customer]), MailModule, CartsModule],
  controllers: [CustomerController],
  providers: [CustomerService, TokenService],
})
export class CustomerModule {}
