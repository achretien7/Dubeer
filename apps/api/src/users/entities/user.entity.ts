import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true })
    email: string;

    @Column()
    provider: string;

    @Column()
    providerId: string;

    @CreateDateColumn()
    createdAt: Date;
}
