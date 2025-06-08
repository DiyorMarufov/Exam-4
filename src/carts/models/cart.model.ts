import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { Customer } from '../../customer/model/customer.model';
import { CartItems } from '../../cart-items/models/cart-item.model';

@Table({ tableName: 'carts' })
export class Carts extends Model {
  @ForeignKey(() => Customer)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  buyer_id: number;

  @BelongsTo(() => Customer, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  customer: Customer;

  @HasMany(() => CartItems)
  items: CartItems[];
}
