import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  ManyToOne,
  Unique,
} from 'typeorm';
import { User } from './user.model';

@Entity({ name: 'own_words' })
@Unique('OwnWordExistsException', ['value', 'user'])
export class OwnWord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  value: string;

  @Column()
  comment: string;

  @ManyToOne(() => User, (u) => u.ownwords, { onDelete: 'CASCADE' })
  user: User;
}
