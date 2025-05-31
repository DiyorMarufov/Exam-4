import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Customer } from '../../customer/model/customer.model';

@Table({ tableName: 'reports' })
export class reports extends Model {
  @ForeignKey(() => Customer)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  user_id: number;

  @BelongsTo(() => Customer)
  customer: Customer;

  @Column({
    type: DataType.ENUM('bug', 'feature', 'feedback', 'abuse', 'other'),
    allowNull: false,
  })
  report_type: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  data: string;
}
