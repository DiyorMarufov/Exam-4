import { PartialType } from '@nestjs/swagger';
import { CreateNotificationDto } from './create-notification.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateNotificationDto extends PartialType(CreateNotificationDto) {
  @IsNotEmpty({ message: 'User_id is required' })
  @IsString({ message: 'user_id must be a string' })
  user_id?: string;

  @IsString({ message: 'notification_text must  be a string' })
  @IsNotEmpty({ message: 'Email is required' })
  notification_text?: string;

  @IsNotEmpty({ message: 'typpe is required' })
  type?: string;
}
