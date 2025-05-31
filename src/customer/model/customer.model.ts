import {
  Column,
  DataType,
  Model,
  Table,
  HasOne,
  HasMany,
} from 'sequelize-typescript';
import { Carts } from '../../carts/models/cart.model';
import { Orders } from '../../orders/models/order.model';

@Table({ tableName: 'customers' })
export class Customer extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare phone: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare hashed_password: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare role: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare address: string;

  @HasOne(() => Carts)
  cart: Carts;

  @HasMany(() => Orders)
  order: Orders;
}
