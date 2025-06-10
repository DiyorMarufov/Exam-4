import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CategoriesModule } from './categories/categories.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { categories } from './categories/models/category.model';
import { ReportsModule } from './reports/reports.module';
import { reports } from './reports/models/report.model';
import { ProductsModule } from './products/products.module';
import { RewiewsModule } from './rewiews/rewiews.module';
import { products } from './products/models/product.model';
import { categoriesImage } from './categories/models/category.images.model';
import { reviews } from './rewiews/models/rewiew.models';
import { ServeStaticModule } from '@nestjs/serve-static';
import { resolve } from 'path';
import { productsImage } from './products/models/products.images.model';

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
      models: [
        categories,
        reports,
        products,
        categoriesImage,
        reviews,
        productsImage,
      ],
    }),
    ServeStaticModule.forRoot({
      rootPath: resolve(__dirname, '..', '..', '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    CategoriesModule,
    ReportsModule,
    ProductsModule,
    RewiewsModule,
  ],
})
export class AppModule {}
