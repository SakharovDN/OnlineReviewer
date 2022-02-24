import { PrimaryGeneratedColumn, Column, Entity, OneToMany } from 'typeorm';
import { OwnWord } from './own-word.model';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}
@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({ default: false })
  verified: boolean;

  @Column({ default: false })
  banned: boolean;

  @Column({ nullable: true })
  pathDictionary: string;

  @OneToMany(() => OwnWord, w => w.user, { cascade: true })
  ownwords: OwnWord[];

}
