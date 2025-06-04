import {
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { NotificationType } from '../../enums/notification.type';
import { Customer } from '../../customer/model/customer.model';

@Table({ tableName: 'notification' })
export class Notification extends Model {
  @ForeignKey(() => Customer)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  customer_id: number;

  @BelongsTo(() => Customer)
  customer: Customer;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  notification_text: string;

  @Column({
    type: DataType.ENUM(
      NotificationType.MESSAGE,
      NotificationType.LIKE,
      NotificationType.COMMENT,
      NotificationType.FOLLOW,
      NotificationType.SYSTEM,
      NotificationType.REMINDER,
    ),
    allowNull: false,
  })
  type: NotificationType;
}
