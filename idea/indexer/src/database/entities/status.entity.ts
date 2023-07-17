import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity()
export class Status {
  constructor(props: Partial<Status>) {
    Object.assign(this, props);
  }

  @PrimaryColumn()
  public height: string;

  @Column({ nullable: true })
  public hash: string;

  @Index()
  @Column()
  public genesis: string;
}
