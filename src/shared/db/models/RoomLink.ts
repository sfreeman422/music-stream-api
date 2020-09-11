import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Link } from './Link';
import { Room } from './Room';
import { User } from './User';

@Entity()
export class RoomLink {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @ManyToMany(
    _type => Link,
    link => link.id,
  )
  public link!: string;

  @ManyToMany(
    _type => Room,
    room => room.id,
  )
  public room!: string;

  @ManyToMany(
    _type => User,
    user => user.id,
  )
  public user!: string;

  @Column({ default: false })
  public played!: boolean;

  @Column({ default: 0 })
  public upvotes!: number;

  @Column({ default: 0 })
  public downvotes!: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  public createdAt!: Date;
}
