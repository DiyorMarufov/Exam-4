import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'reports' })
export class reports extends Model {
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  user_id: number;

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
