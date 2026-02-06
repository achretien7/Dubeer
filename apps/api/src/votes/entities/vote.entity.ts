import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, Unique } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Price } from '../../prices/entities/price.entity';

@Entity()
@Unique(['user', 'price']) // One vote per user per price
export class Vote {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'int' })
    value: number; // 1 or -1

    @CreateDateColumn()
    created_at: Date;

    @ManyToOne(() => User)
    user: User;

    @ManyToOne(() => Price)
    price: Price;
}
