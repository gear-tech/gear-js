import { Column, Entity, PrimaryColumn } from 'typeorm';

import type { CodeStatus, MetaType } from '../enums/index.js';
import { hexToBytea } from '../transformers.js';
import { BaseEntity } from './base.entity.js';

@Entity()
export class Code extends BaseEntity {
  constructor(props?: Partial<Code>) {
    super();
    Object.assign(this, props);
  }

  @PrimaryColumn({ type: 'bytea', transformer: hexToBytea })
  public id: string;

  @Column({ type: 'bytea', name: 'uploaded_by', nullable: true, transformer: hexToBytea })
  public uploadedBy: string;

  @Column({ nullable: true })
  public name: string;

  @Column({ type: 'text' })
  public status: CodeStatus;

  @Column({ nullable: true })
  public expiration?: string;

  @Column({ nullable: true, name: 'meta_type' })
  public metaType?: MetaType | null;

  // TODO: remove later
  @Column({ nullable: true })
  public metahash?: string | null;
}
