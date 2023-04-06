import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Block {
  @PrimaryGeneratedColumn('uuid')
  public _id: string;

  @Index()
  @Column()
  public number: string;

  @Column({ nullable: true })
  public hash: string;

  @Column({ nullable: true, type: 'timestamp' })
  public timestamp: Date;

  @Index()
  @Column()
  public genesis: string;
}
