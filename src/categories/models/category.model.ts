import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { products } from '../../products/models/product.model';

@Table({ tableName: 'categories' })
export class categories extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  description: string;

  @Column({
    type: DataType.STRING,
  })
  image: string;

  @HasMany(() => products)
  product: products[];
}
