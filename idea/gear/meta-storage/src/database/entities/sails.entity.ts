import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Code } from './code.entity';

@Entity()
export class SailsIdl {
  constructor(props: Partial<SailsIdl>) {
    Object.assign(this, props);
  }

  @PrimaryColumn()
  public id: string;

  @Column()
  public data: string;

  @OneToMany(() => Code, (code) => code.id)
  public codes: Code[];
}
