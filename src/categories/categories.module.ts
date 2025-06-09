import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { categories } from './models/category.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { FileModule } from '../file/file.module';
import { CategoriesImage } from './models/category-image.model';

@Module({
  imports: [
    SequelizeModule.forFeature([categories, CategoriesImage]),
    FileModule,
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
