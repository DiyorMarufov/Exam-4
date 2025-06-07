import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { orderStatus } from '../../enums/order-status';
import { deliveryMethod } from '../../enums/delivery-method';
import { Customer } from '../../customer/model/customer.model';
import { OrderItems } from '../../order-items/models/order-item.model';

@Table({ tableName: 'orders' })
export class Orders extends Model {
  @ForeignKey(() => Customer)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  buyer_id: number;

  @BelongsTo(() => Customer, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  customer: Customer;

  @HasMany(() => OrderItems)
  orderItem: OrderItems[];

  @Column({
    type: DataType.ENUM(
      orderStatus.PENDING,
      orderStatus.SHIPPED,
      orderStatus.DELIVERED,
      orderStatus.CANCELLED,
    ),
    defaultValue: orderStatus.PENDING,
  })
  order_status: orderStatus.PENDING;

  @Column({
    type: DataType.ENUM(
      deliveryMethod.PICKUP,
      deliveryMethod.COURIER,
      deliveryMethod.DIGITAL,
    ),
    allowNull: false,
  })
  delivery_method: deliveryMethod;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  delivery_address: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  contact_phone: string;

  @Column({
    type: DataType.ARRAY(DataType.INTEGER),
    allowNull: false,
  })
  cart_item_id: number[];
}
