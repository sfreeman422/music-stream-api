import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Room } from './Room';
import { User } from './User';

@Entity()
export class Message {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @ManyToOne(
    _type => User,
    user => user.id,
  )
  public user!: string;

  @ManyToOne(
    _type => Room,
    room => room.id,
  )
  public room!: string;

  @Column()
  public message!: string;

  @Column()
  public email!: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  public createdAt!: Date;
}
