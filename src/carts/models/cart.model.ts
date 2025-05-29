import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany
} from 'sequelize-typescript';
import { Users } from '../../users/models/user.model';
import { CartItems } from '../../cart-items/models/cart-item.model';

@Table({ tableName: 'carts' })
export class Carts extends Model {
  @ForeignKey(() => Users)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  buyer_id: number;

  @BelongsTo(() => Users)
  user: Users;

  @HasMany(() => CartItems)
  items: CartItems[];
}
