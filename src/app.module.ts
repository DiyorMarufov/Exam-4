import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CategoriesModule } from './categories/categories.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { categories } from './categories/models/category.model';
import { ReportsModule } from './reports/reports.module';
import { reports } from './reports/models/report.model';
import { ProductsModule } from './products/products.module';
import { RewiewsModule } from './rewiews/rewiews.module';

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
      models: [categories, reports],
    }),
    CategoriesModule,
    ReportsModule,
    ProductsModule,
    RewiewsModule,
  ],
})
export class AppModule {}
