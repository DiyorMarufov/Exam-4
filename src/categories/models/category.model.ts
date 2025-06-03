import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { products } from '../../products/models/product.model';

@Table({ tableName: 'categories' })
export class categories extends Model {
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  description: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  image: string;

  @HasMany(() => products)
  product: products[];
}
