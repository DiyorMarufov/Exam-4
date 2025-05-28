import { Table, Column, Model, DataType } from 'sequelize-typescript';

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
}