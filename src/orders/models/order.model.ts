import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { orderStatus } from '../../enums/order-status';
import { deliveryMethod } from '../../enums/delivery-method';
import { Users } from '../../users/models/user.model';

@Table({ tableName: 'orders' })
export class Orders extends Model {
  @ForeignKey(() => Users)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  buyer_id: number;

  @Column({
    type: DataType.ENUM(
      orderStatus.PENDING,
      orderStatus.PROCESSING,
      orderStatus.SHIPPED,
      orderStatus.DELIVERED,
      orderStatus.CANCELLED,
      orderStatus.FAILED,
      orderStatus.REFUNDED,
    ),
    defaultValue: orderStatus.PENDING,
  })
  order_status: orderStatus;

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
}
