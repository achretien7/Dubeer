import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Venue } from '../../venues/entities/venue.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Price {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('decimal', { nullable: true })
  amount: number;

  @Column({ type: 'int', nullable: true })
  amountCents: number;

  @Column({ default: 'beer' })
  beverageType: string;

  @Column({ default: '50cl' })
  format: string;

  @Column({ default: 'AED' })
  currency: string;

  @Column({ type: 'int', default: 0 })
  score: number;

  @CreateDateColumn()
  created_at: Date;

  @Column()
  venueId: string;

  @ManyToOne(() => Venue)
  @JoinColumn({ name: 'venueId' })
  venue: Venue;

  @Column({ nullable: true })
  userId: string | null;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User;
}

