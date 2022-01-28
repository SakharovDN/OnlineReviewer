import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';

@Entity({name: 'words'})
export class Word {

    @PrimaryGeneratedColumn()
    id: number

    @Column({unique: true})
    value: string

    @Column({length: 500})
    comment: string
}