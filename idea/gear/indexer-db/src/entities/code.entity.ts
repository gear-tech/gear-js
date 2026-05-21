import { Column, Entity, PrimaryColumn } from 'typeorm';

import { CodeStatus, MetaType } from '../enums/index.js';
import { codeStatusTransformer, hexToBytea } from '../transformers.js';
import type { PgByteaString } from '../types.js';

@Entity()
export class Code {
  constructor(props?: Partial<Code>) {
    Object.assign(this, props);
  }

  @PrimaryColumn({ type: 'varchar', length: 66 })
  public id: string;

  @Column({ type: 'enum', enum: CodeStatus, transformer: codeStatusTransformer })
  public status: CodeStatus;

  @Column({ name: 'block_number', type: 'bigint' })
  public blockNumber: string;

  @Column({ type: 'timestamptz' })
  public timestamp: Date;

  @Column({ nullable: true, name: 'meta_type', type: 'enum', enum: MetaType })
  public metaType?: MetaType | null;

  // ── variable-length ───────────────────────────────────────────────────────

  @Column({ type: 'bytea', name: 'uploaded_by', nullable: true, transformer: hexToBytea })
  public uploadedBy: PgByteaString;

  @Column({ nullable: true, name: 'block_hash', type: 'bytea', transformer: hexToBytea })
  public blockHash: string;

  @Column({ nullable: true })
  public name: string;

  @Column({ nullable: true })
  public expiration?: string;

  // TODO: remove later
  @Column({ nullable: true })
  public metahash?: string | null;
}
