import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { Orders } from '../../orders/models/order.model';

@Table({ tableName: 'order-items' })
export class OrderItems extends Model {
  @ForeignKey(() => Orders)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  order_id: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  product_id?: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  quantity: number;

  @Column({
    type: DataType.DECIMAL,
    allowNull: false,
  })
  price: number;
}
