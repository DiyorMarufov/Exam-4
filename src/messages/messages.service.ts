import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Messages } from '../messages/models/message.model';
import { catchError } from '../utils/error-catch';

@Injectable()
export class MessagesService {
  constructor(@InjectModel(Messages) private model: typeof Messages) {}
  async create(createMessageDto: CreateMessageDto) {
    try {
      const newMessage = await this.model.create({ ...createMessageDto });
      return {
        statusCode: 201,
        message: 'success',
        data: newMessage,
      };
    } catch (e) {
      return catchError(e);
    }
  }

  async findAll() {
    try {
      return {
        statusCode: 200,
        message: 'success',
        data: await this.model.findAll(),
      };
    } catch (e) {
      return catchError(e);
    }
  }
  
  async findOne(id: number) {
    try {
      const message = await this.model.findByPk(id);
      if (!message) {
        throw new NotFoundException(`Message with ID ${id} not found`);
      }
      return {
        statusCode: 200,
        message: 'success',
        data: message,
      };
    } catch (e) {
      return catchError(e);
    }
  }

  async update(id: number, updateMessageDto: UpdateMessageDto) {
    try {
      const [count, rows] = await this.model.update(updateMessageDto, {
        where: { id },
        returning: true,
      });

      if (count === 0) {
        throw new BadRequestException(`Data not found or not updated`);
      }

      return {
        statusCode: 200,
        message: 'success',
        data: rows[0],
      };
    } catch (e) {
      return catchError(e);
    }
  }

  async remove(id: number) {
    try {
      const count = await this.model.destroy({ where: { id } });

      if (count === 0) {
        throw new BadRequestException(`Data not found or not deleted`);
      }
      return {
        statusCode: 200,
        message: 'success',
        data: {},
      };
    } catch (e) {
      return catchError(e);
    }
  }
}
