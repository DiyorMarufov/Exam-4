import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { reports } from './models/report.model';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { catchError } from 'src/utils/error-catch';

@Injectable()
export class ReportsService {
  constructor(@InjectModel(reports) private reportModel: typeof reports) {}

  async create(createReportDto: CreateReportDto): Promise<reports> {
    try {
      return await this.reportModel.create({ ...createReportDto });
    } catch (error) {
      return catchError(error);
    }
  }

  async findAll(): Promise<reports[]> {
    try {
      return await this.reportModel.findAll();
    } catch (error) {
      return catchError(error);
    }
  }

  async findOne(id: number): Promise<reports> {
    try {
      const report = await this.reportModel.findByPk(id);
      if (!report) {
        throw new NotFoundException(`Report with ID ${id} not found`);
      }
      return report;
    } catch (error) {
      return catchError(error);
    }
  }

  async update(id: number, updateReportDto: UpdateReportDto): Promise<reports> {
    try {
      const report = await this.findOne(id);
      return await report.update(updateReportDto);
    } catch (error) {
      return catchError(error);
    }
  }

  async remove(id: number): Promise<object> {
    try {
      const count = await this.reportModel.destroy({where:{id}})

      if(count === 0){
        throw new BadRequestException(`Data with ID ${id} not found`)
      }
      return{
        data: {}
      }
    } catch (error) {
      return catchError(error);
    }
  }
}
