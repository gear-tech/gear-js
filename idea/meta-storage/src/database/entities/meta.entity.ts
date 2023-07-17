import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Code } from './code.entity';

@Entity()
export class Meta {
  constructor(props: Partial<Meta>) {
    Object.assign(this, props);
  }

  @PrimaryColumn()
    hash: string;

  @Column({ nullable: true })
    hex: string;

  @OneToMany(() => Code, (_) => _.meta)
    codes: Code[];
}
