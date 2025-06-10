import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { categoriesImage } from './category.images.model';

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

  @HasMany(() => categoriesImage, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  categoryImage: categoriesImage;
}
