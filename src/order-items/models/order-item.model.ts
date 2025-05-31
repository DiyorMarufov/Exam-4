import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Orders } from '../../orders/models/order.model';
import { products } from '../../products/models/product.model';

@Table({ tableName: 'order-items' })
export class OrderItems extends Model {
  @ForeignKey(() => Orders)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  order_id: number;

  @BelongsTo(() => Orders)
  order: Orders;

  @ForeignKey(() => products)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  product_id: number;

  @BelongsTo(() => products)
  products: products;

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
