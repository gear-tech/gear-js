import { Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Meta } from './meta.entity';

@Entity()
export class Code {
  constructor(props: Code) {
    Object.assign(this, props);
  }

  @PrimaryColumn()
    id: string;

  @ManyToOne(() => Meta, (_) => _.codes)
    meta: Meta;
}
