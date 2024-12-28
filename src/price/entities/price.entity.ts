import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Price {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  token: string;

  @Column('decimal')
  price: number;

  @CreateDateColumn()
  timestamp: Date;
}
