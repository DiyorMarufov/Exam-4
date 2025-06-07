import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { reports } from './models/report.model';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { catchError } from 'src/utils/error-catch';
import { successRes } from '../utils/success-response';

@Injectable()
export class ReportsService {
  constructor(@InjectModel(reports) private reportModel: typeof reports) {}

  async create(createReportDto: CreateReportDto): Promise<object> {
    try {
      const newReport = await this.reportModel.create({ ...createReportDto });
      return successRes(newReport, 201);
    } catch (error) {
      return catchError(error);
    }
  }

  async findAll(): Promise<object> {
    try {
      const reports = await this.reportModel.findAll({
        include: { all: true },
      });
      return successRes(reports);
    } catch (error) {
      return catchError(error);
    }
  }

  async findOne(id: number): Promise<object> {
    try {
      const report = await this.reportModel.findByPk(id, {
        include: { all: true },
      });
      if (!report) {
        throw new NotFoundException(`Report with ID ${id} not found`);
      }
      return successRes(report);
    } catch (error) {
      return catchError(error);
    }
  }

  async update(id: number, updateReportDto: UpdateReportDto): Promise<object> {
    try {
      const [count, rows] = await this.reportModel.update(updateReportDto, {
        where: { id },
        returning: true,
      });

      if (!count) {
        throw new BadRequestException(
          `Data with ID ${id} not found or not deleted`,
        );
      }

      return successRes(rows[0]);
    } catch (error) {
      return catchError(error);
    }
  }

  async remove(id: number): Promise<object> {
    try {
      const count = await this.reportModel.destroy({ where: { id } });

      if (!count) {
        throw new BadRequestException(`Data with ID ${id} not found`);
      }
      return successRes();
    } catch (error) {
      return catchError(error);
    }
  }
}
