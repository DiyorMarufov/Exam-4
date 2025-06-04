import {
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { PaymentMethod } from '../../enums/payment-method';
import { Orders } from '../../orders/models/order.model';

@Table({ tableName: 'payments' })
export class Payment extends Model {
  @ForeignKey(() => Orders)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  order_id: number;

  @BelongsTo(() => Orders)
  order: Orders;

  @Column({
    type: DataType.DECIMAL,
    allowNull: false,
  })
  amount: number;

  @Column({
    type: DataType.ENUM(
      PaymentMethod.CREDIT_CARD,
      PaymentMethod.CASH,
      PaymentMethod.PAYPAL,
      PaymentMethod.BANK_TRANSFER,
    ),
    allowNull: false,
  })
  payment_method: PaymentMethod;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  receipt_number: string;
}
