import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Notification } from './model/notification.model';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { catchError } from '../utils/error-catch';
import { successRes } from '../utils/success-response';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification)
    private notificationModel: typeof Notification,
  ) {}

  async create(createNotificationDto: CreateNotificationDto): Promise<object> {
    try {
      const newNotification = await this.notificationModel.create({
        ...createNotificationDto,
      });

      return successRes(newNotification);
    } catch (error) {
      return catchError(error);
    }
  }

  async findAll(): Promise<object | undefined> {
    try {
      const notifications = await this.notificationModel.findAll({
        include: { all: true },
      });
      return successRes(notifications);
    } catch (error) {
      return catchError(error);
    }
  }

  async findAllForCustomer(req: any): Promise<object | undefined> {
    try {
      const notifications = await this.notificationModel.findAll({
        where: { customer_id: req.user.id },
        include: { all: true },
      });

      if (!notifications) {
        throw new ForbiddenException(
          `You are not the owner of this notification`,
        );
      }
      return successRes(notifications);
    } catch (error) {
      return catchError(error);
    }
  }

  async findOne(id: number): Promise<object | undefined> {
    try {
      const notification = await this.notificationModel.findByPk(id, {
        include: { all: true },
      });
      if (!notification) {
        throw new NotFoundException(`Notification with ID ${id} not found`);
      }
      return successRes(notification);
    } catch (error) {
      return catchError(error);
    }
  }

  async update(
    id: number,
    updateNotificationDto: UpdateNotificationDto,
  ): Promise<object | undefined> {
    try {
      const [count, rows] = await this.notificationModel.update(
        updateNotificationDto,
        {
          where: { id },
          returning: true,
        },
      );

      if (!count) {
        throw new BadRequestException(
          `Data with ID ${id} not found or not updated`,
        );
      }

      return successRes(rows[0]);
    } catch (e) {
      return catchError(e);
    }
  }

  async remove(id: number): Promise<object | undefined> {
    try {
      const count = await this.notificationModel.destroy({
        where: { id },
      });
      if (!count) {
        throw new NotFoundException(
          `Data with ID ${id} not found or not deleted`,
        );
      }
      return successRes();
    } catch (error) {
      catchError(error);
    }
  }
}
