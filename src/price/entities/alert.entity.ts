import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Alert {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  token: string;

  @Column('decimal')
  targetPrice: number;

  @Column()
  email: string;

  @Column({ default: false })
  triggered: boolean;
}
