import { Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { SailsIdl } from './sails.entity';

@Entity()
export class Code {
  constructor(props: Partial<Code>) {
    Object.assign(this, props);
  }

  @PrimaryColumn()
    id: string;

  @ManyToOne(() => SailsIdl, (sails) => sails.codes)
    sails: SailsIdl;
}
