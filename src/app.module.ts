import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';
import { OrdersModule } from './orders/orders.module';
import { OrderItemsModule } from './order-items/order-items.module';
import { CartsModule } from './carts/carts.module';
import { CartItemsModule } from './cart-items/cart-items.module';
import { Carts } from './carts/models/cart.model';
import { CartItems } from './cart-items/models/cart-item.model';
import { Orders } from './orders/models/order.model';
import { OrderItems } from './order-items/models/order-item.model';
import { Customer } from './customer/model/customer.model';
import { CustomerModule } from './customer/customer.module';
import { Seller } from './seller/model/seller.model';
import { SellerModule } from './seller/seller.module';
import { AdminModule } from './admin/admin.module';
import { Admin } from './admin/model/admin.model';
import { MailModule } from './mail/mail.module';
import { CacheModule, CacheInterceptor } from '@nestjs/cache-manager';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: String(process.env.DB_PASS),
      database: process.env.PG_DB,
      synchronize: true,
      logging: false,
      autoLoadModels: true,
      models: [Carts, CartItems, Orders, OrderItems, Admin, Customer, Seller],
    }),
    CacheModule.register({
      isGlobal: true,
    }),
    JwtModule.register({
      global: true,
    }),
    OrdersModule,
    OrderItemsModule,
    CartsModule,
    CartItemsModule,
    AdminModule,
    MailModule,
    CustomerModule,
    SellerModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}
