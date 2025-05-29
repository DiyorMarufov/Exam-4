import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Users } from './models/user.model';
import { Carts} from '../carts/models/cart.model';

@Module({
  imports: [SequelizeModule.forFeature([Users, Carts])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
