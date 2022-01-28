import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';

@Entity({name: 'tokens'})
export class Token {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    userId: string
    
    @Column({length: 800})
    token: string
}