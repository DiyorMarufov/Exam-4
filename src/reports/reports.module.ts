import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { reports } from './models/report.model';
@Module({
  imports: [SequelizeModule.forFeature([reports])],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
