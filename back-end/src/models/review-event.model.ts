import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';

@Entity({ name: 'review_events' })
export class ReviewEvent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  timestamp: Date;
}
