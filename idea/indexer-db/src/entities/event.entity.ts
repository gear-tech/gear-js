import { Column, Entity, Index, PrimaryColumn } from 'typeorm';
import { HexString } from '@gear-js/api';

import { BaseEntity } from './base.entity';

@Entity()
export class Event extends BaseEntity {
  constructor(props?: Partial<Event>) {
    super();
    Object.assign(this, props);
  }

  @PrimaryColumn()
  public id: string;

  @Index()
  @Column()
  public source: string;

  @Column({ nullable: true })
  public payload: string | null;

  @Column({ nullable: true, name: 'parent_id' })
  public parentId: string | null;

  @Column({ nullable: true })
  public service?: string | null;

  @Column({ nullable: true })
  public name?: string | null;
}
