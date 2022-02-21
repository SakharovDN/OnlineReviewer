import { PrimaryGeneratedColumn, Column, Entity, Unique } from 'typeorm';

@Entity({ name: 'words' })
@Unique('WordExistsException', ['value'])
export class Word {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  value: string;

  @Column({ length: 500 })
  comment: string;
}
