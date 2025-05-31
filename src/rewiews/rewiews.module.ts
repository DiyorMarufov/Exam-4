import { Module } from '@nestjs/common';
import { RewiewsService } from './rewiews.service';
import { RewiewsController } from './rewiews.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { reviews } from './models/rewiew.models';
@Module({
  imports: [SequelizeModule.forFeature([reviews])],
  controllers: [RewiewsController],
  providers: [RewiewsService],
})
export class RewiewsModule {}
