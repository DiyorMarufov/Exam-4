import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'sellers' })
export class Seller extends Model {
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  email: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  phone: string;

  @Column({ type: DataType.STRING, allowNull: false })
  hashed_password: string;

  @Column({ type: DataType.STRING, allowNull: false })
  role: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  address: string;
}
