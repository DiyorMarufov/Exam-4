import { Table, Column, Model, DataType } from 'sequelize-typescript';
import { Roles } from 'src/ENUM';

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
  role: Roles.SELLER;

  @Column({ type: DataType.STRING, allowNull: false })
  address: string;
}
