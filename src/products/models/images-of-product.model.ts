import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { products } from '../models/product.model';

@Table({ tableName: 'products-image' })
export class ProductsImage extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  image_url: string;

  @ForeignKey(() => products)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  product_id: number;

  @BelongsTo(() => products)
  product: products;
}
