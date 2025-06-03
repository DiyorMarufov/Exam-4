import { Column, DataType, Model, Table } from 'sequelize-typescript';
@Table({ tableName: 'notification' })
export class Notification extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  user_id: string;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  notification_text: string;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  type: string;
}
