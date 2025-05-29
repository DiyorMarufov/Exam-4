import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { Users } from '../../users/models/user.model';

@Table({ tableName: 'messages' })
export class Messages extends Model {
  @ForeignKey(() => Users)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  sender_id: number;

  @ForeignKey(() => Users)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  receiver_id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  message_text: string;
}
