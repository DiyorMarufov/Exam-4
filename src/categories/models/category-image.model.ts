import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { categories } from './category.model';

@Table({ tableName: 'categories-image' })
export class CategoriesImage extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  image_url: string;

  @ForeignKey(() => categories)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  category_id: number;

  @BelongsTo(() => categories)
  category: categories;
}
