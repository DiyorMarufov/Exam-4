import { Module } from '@nestjs/common';
import { AdminModule } from './admin/admin.module';
import { CustomerModule } from './customer/customer.module';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Customer } from './customer/model/customer.model';
import { Admin } from './admin/model/admin.model';
import { JwtModule } from '@nestjs/jwt';
import { Seller } from './seller/model/seller.model';
import { SellerModule } from './seller/seller.module';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'localhost',
      port: Number(process.env.PG_PORT),
      username: process.env.PG_USER,
      password: String(process.env.PG_PASS),
      database: process.env.PG_DB,
      logging: false,
      models: [Customer, Admin, Seller],
      autoLoadModels: true,
      sync: { force: true },
    }),
    JwtModule.register({ global: true }),
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    CustomerModule,
    AdminModule,
    SellerModule,
  ],
})
export class AppModule {}
