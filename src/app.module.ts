import { Module } from '@nestjs/common';
import { AdminModule } from './admin/admin.module';
import { SellerModule } from './seller/seller.module';
import { CustomerModule } from './customer/customer.module';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Customer } from './customer/model/customer.model';

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
      models: [Customer],
      autoLoadModels: true,
      sync: { alter: true },
    }),
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    CustomerModule,
    AdminModule,
    SellerModule,
  ],
})
export class AppModule {}
