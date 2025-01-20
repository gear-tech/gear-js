import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Meta {
  constructor(props: Partial<Meta>) {
    Object.assign(this, props);
  }

  @PrimaryColumn()
  public hash: string;

  @Column({ nullable: true })
  public hex: string;

  @Column({ nullable: true })
  public hasState: boolean;
}
