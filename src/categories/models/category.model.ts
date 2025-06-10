import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { products } from '../../products/models/product.model';
import { CategoriesImage } from './category-image.model';

@Table({ tableName: 'categories' })
export class categories extends Model {
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  description: string;

  @HasMany(() => products)
  product: products[];

  @HasMany(() => CategoriesImage, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  categoryImage: CategoriesImage;
}
