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
import { AdminsModule } from './admins/admins.module';
import { Admin } from './admins/models/admin.model';
import { products } from './products/models/product.model';
import { ProductsModule } from './products/products.module';
import { categories } from './categories/models/category.model';
import { CategoriesModule } from './categories/categories.module';
import { reports } from './reports/models/report.model';
import { ReportsModule } from './reports/reports.module';
import { reviews } from './rewiews/models/rewiew.models';
import { Notification } from './notifications/model/notification.model';
import { NotificationsModule } from './notifications/notifications.module';
import { Payment } from './payment/model/payment.model';
import { PaymentModule } from './payment/payment.module';
import { SellerProfile } from './seller-profiles/model/seller-profile.model';
import { SellerProfilesModule } from './seller-profiles/seller-profiles.module';
import { RewiewsModule } from './rewiews/rewiews.module';
import { MailModule } from './mail/mail.module';
import { CacheModule, CacheInterceptor } from '@nestjs/cache-manager';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { resolve } from 'path';
import { FileModule } from './file/file.module';
import { ProductsImage } from './products/models/images-of-product.model';
import { CategoriesImage } from './categories/models/category-image.model';

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
      models: [
        Carts,
        CartItems,
        Orders,
        OrderItems,
        Admin,
        Customer,
        Seller,
        products,
        categories,
        reports,
        reviews,
        Notification,
        Payment,
        SellerProfile,
        ProductsImage,
        CategoriesImage,
      ],
    }),
    ServeStaticModule.forRoot({
      rootPath: resolve(__dirname, '..', '..', 'uploads'),
      serveRoot: '/uploads',
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
    AdminsModule,
    MailModule,
    CustomerModule,
    SellerModule,
    ProductsModule,
    CategoriesModule,
    ReportsModule,
    RewiewsModule,
    AdminsModule,
    FileModule,
    NotificationsModule,
    PaymentModule,
    SellerProfilesModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}
