import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'payments' })
export class Payment extends Model {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  order_id: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  amount: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  payment_method: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  reciept_nummber: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  paid_at: Date;
}
