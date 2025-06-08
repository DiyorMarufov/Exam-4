import {
  Injectable,
  NotFoundException,
  ForbiddenException,
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

  async findAllForCustomer(req: any): Promise<object> {
    try {
      const reports = await this.reportModel.findAll({
        where: { user_id: req.user.id },
        include: { all: true },
      });

      if (!reports) {
        throw new ForbiddenException(`You are not the owner of this report`);
      }
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

  async update(
    customerId: number,
    updateReportDto: UpdateReportDto,
  ): Promise<object> {
    try {
      const report = await this.reportModel.findOne({
        where: { user_id: customerId },
      });

      if (!report) {
        throw new NotFoundException(
          `Report not found with Customer ID ${customerId}`,
        );
      }

      await report.update(updateReportDto);

      return successRes(report);
    } catch (error) {
      return catchError(error);
    }
  }

  async remove(customerId: number): Promise<object> {
    try {
      const report = await this.reportModel.findOne({
        where: { user_id: customerId },
      });

      if (!report) {
        throw new NotFoundException(
          `Report with Customer ID ${customerId} not found`,
        );
      }
      await report.destroy();
      return successRes();
    } catch (error) {
      return catchError(error);
    }
  }
}
