import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

import { hexToBytea } from '../transformers.js';
import { BaseEntity } from './base.entity.js';

@Entity()
export class Event extends BaseEntity {
  constructor(props?: Partial<Event>) {
    super();
    Object.assign(this, props);
  }

  @PrimaryColumn({ type: 'bytea', transformer: hexToBytea })
  public id: string;

  @Index()
  @Column({ type: 'bytea', transformer: hexToBytea })
  public source: string;

  @Column({ type: 'bytea', nullable: true, transformer: hexToBytea })
  public payload: string | null;

  @Column({ type: 'bytea', nullable: true, name: 'parent_id', transformer: hexToBytea })
  public parentId: string | null;

  @Column({ nullable: true })
  public service?: string | null;

  @Column({ nullable: true })
  public name?: string | null;
}
