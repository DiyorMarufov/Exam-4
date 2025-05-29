import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsInt()
  @IsNotEmpty()
  sender_id: number;

  @IsInt()
  @IsNotEmpty()
  receiver_id: number;

  @IsString()
  @IsNotEmpty()
  message_text: string;
}
