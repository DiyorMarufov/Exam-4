import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'reviews' })
export class reviews extends Model {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  buyer_id: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  product_id: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  rating: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  comment:string;
}
