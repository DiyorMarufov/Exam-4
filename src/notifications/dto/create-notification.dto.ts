import { IsNotEmpty, IsString, IsEnum, IsInt } from 'class-validator';
import { NotificationType } from '../../enums/notification.type';

export class CreateNotificationDto {
  @IsNotEmpty({ message: 'customer_id is required' })
  @IsInt({ message: 'customer_id must be an integer' })
  customer_id: number;

  @IsString({ message: 'notification_text must  be a string' })
  @IsNotEmpty({ message: 'Email is required' })
  notification_text: string;

  @IsNotEmpty({ message: 'type is required' })
  @IsEnum(NotificationType)
  type: NotificationType;
}
