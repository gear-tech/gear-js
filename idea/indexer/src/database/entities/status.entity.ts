import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity()
export class Status {
  @PrimaryColumn()
  public height: string;

  @Column({ nullable: true })
  public hash: string;

  @Index()
  @Column()
  public genesis: string;
}
