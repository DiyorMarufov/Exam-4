import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { OrdersModule } from './orders/orders.module';
import { OrderItemsModule } from './order-items/order-items.module';
import { CartsModule } from './carts/carts.module';
import { CartItemsModule } from './cart-items/cart-items.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { Carts } from './carts/models/cart.model';
import { Users } from './users/models/user.model';
import { CartItems } from './cart-items/models/cart-item.model';
import { Orders } from './orders/models/order.model';
import { OrderItems } from './order-items/models/order-item.model';

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
      password: process.env.DB_PASS,
      database: process.env.PG_DB,
      synchronize: true,
      logging: false,
      autoLoadModels: true,
      models: [Carts, Users, CartItems, Orders, OrderItems],
    }),
    OrdersModule,
    OrderItemsModule,
    CartsModule,
    CartItemsModule,
    UsersModule,
    ProductsModule,
  ],
})
export class AppModule {}
