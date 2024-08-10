import { Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { SailsIdl } from './sails.entity';

@Entity()
export class Code {
  constructor(props: Partial<Code>) {
    Object.assign(this, props);
  }

  @PrimaryColumn()
  public id: string;

  @ManyToOne(() => SailsIdl, (sails) => sails.id)
  public sails: SailsIdl;
}
