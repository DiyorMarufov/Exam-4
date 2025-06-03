import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Notification } from './model/notification.model';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { catchError } from '../utils/catch-error';
import { NotFoundError } from 'rxjs';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification)
    private notificationModel: typeof Notification,
  ) {}

  async create(
    createNotificationDto: CreateNotificationDto,
  ): Promise<Notification> {
    try {
      console.log(createNotificationDto.notification_text);

      return this.notificationModel.create({ ...createNotificationDto });
    } catch (error) {
      catchError(error);
    }
    return this.notificationModel.create(createNotificationDto as any);
  }

  async findAll(): Promise<Notification[] | undefined> {
    try {
      return this.notificationModel.findAll();
    } catch (error) {
      catchError(error);
    }
  }

  async findOne(id: number): Promise<Notification | undefined> {
    try {
      const notification = await this.notificationModel.findByPk(id);
      if (!notification) {
        throw new NotFoundException('Bunday id lik notificatiion topilmadi');
      }
      return notification;
    } catch (error) {
      catchError(error);
    }
  }

  async update(
    id: number,
    updateNotificationDto: UpdateNotificationDto,
  ): Promise<object | undefined> {
    try {
      const updatedNotification = await this.notificationModel.update(
        updateNotificationDto,
        {
          where: { id },
          returning: true,
        },
      );
      return { data: updatedNotification[1][0], statusCode: 200, message: 'Success' };
    } catch (error) {
      catchError(error);
    }
  }

  async remove(id: number): Promise<{} | undefined> {
    try {
      const Notification = await this.notificationModel.findOne({
        where: { id },
      });
      if (!Notification) {
        throw new NotFoundException();
      }
      await this.notificationModel.destroy({ where: { id } });
      return { data: {}, statusCode: 200, message: 'Success' };
    } catch (error) {
      catchError(error);
    }
  }
}
