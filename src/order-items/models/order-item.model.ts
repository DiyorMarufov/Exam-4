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

  @BelongsTo(() => Orders, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  order: Orders;

  @ForeignKey(() => products)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  product_id: number;

  @BelongsTo(() => products, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  products: products;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  quantity: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  price: number;
}
