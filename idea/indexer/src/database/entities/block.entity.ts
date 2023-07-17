import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Block {
  constructor(props: Partial<Block>) {
    Object.assign(this, props);
  }

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
