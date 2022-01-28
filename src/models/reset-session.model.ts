import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';

@Entity({name: 'reset_session'})
export class ResetPasswordSession  {

    @PrimaryGeneratedColumn("uuid")
    sessionId: string
    
    @Column()
    userId: string

    @Column()
    expire_in: Date

    @Column()
    redirect_to: string
}