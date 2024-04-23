import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Code } from './code.entity';

@Entity()
export class SailsIdl {
  constructor(props: Partial<SailsIdl>) {
    Object.assign(this, props);
  }

  @PrimaryColumn()
    id: string;

  @Column()
    data: string;

  @OneToMany(() => Code, (code) => code.id)
    codes: Code[];
}
