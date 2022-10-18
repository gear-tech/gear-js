import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Block {
  @PrimaryGeneratedColumn('uuid')
    _id: string;

  @Column()
    number: string;

  @Column({ nullable: true })
    hash: string;

  @Column({ nullable: true, type: 'timestamp' })
    timestamp: Date;
}
