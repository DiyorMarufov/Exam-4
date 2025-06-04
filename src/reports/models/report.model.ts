import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Customer } from '../../customer/model/customer.model';
import { ReportType } from '../../enums/report-type';

@Table({ tableName: 'reports' })
export class reports extends Model {
  @ForeignKey(() => Customer)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  user_id: number;

  @BelongsTo(() => Customer, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  customer: Customer;

  @Column({
    type: DataType.ENUM(
      ReportType.ABUSE,
      ReportType.FEATURE,
      ReportType.FEEDBACK,
      ReportType.BUG,
      ReportType.OTHER,
    ),
    allowNull: false,
  })
  report_type: ReportType;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  data: string;
}
