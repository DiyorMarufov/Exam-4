import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Messages } from '../messages/models/message.model';

@Module({
  imports: [SequelizeModule.forFeature([Messages])],
  controllers: [MessagesController],
  providers: [MessagesService],
})
export class MessagesModule {}
