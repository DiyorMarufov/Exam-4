import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { products } from '../../products/models/product.model';
import { Roles } from '../../enums/index';

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

  @Column({ type: DataType.STRING, defaultValue: Roles.SELLER })
  role?: Roles;

  @Column({ type: DataType.TEXT, allowNull: false })
  address: string;

  @HasMany(() => products)
  product: products;
}
