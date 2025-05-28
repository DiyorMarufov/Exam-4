import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { Cart } from '../carts/models/cart.model';

@Module({
  imports: [SequelizeModule.forFeature([User, Cart])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
