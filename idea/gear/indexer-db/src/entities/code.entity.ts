import { Column, Entity, PrimaryColumn } from 'typeorm';

import { CodeStatus, MetaType } from '../enums/index.js';
import { codeStatusTransformer, hexToBytea } from '../transformers.js';
import type { PgByteaString } from '../types.js';

// Column order is tuned for PostgreSQL alignment.
// id (bytea) ends at offset 33. status (int4) fills 33→36 (+3 pad), reaching 8-byte boundary at 40.
// metaType trails after the bigints — offset 56 is 4-byte aligned, zero padding there.

@Entity()
export class Code {
  constructor(props?: Partial<Code>) {
    Object.assign(this, props);
  }

  @PrimaryColumn({ type: 'bytea', transformer: hexToBytea })
  public id: PgByteaString;

  // 33→(3pad)→36: int4 bridges to 8-byte boundary ──────────────────────────

  @Column({ type: 'enum', enum: CodeStatus, transformer: codeStatusTransformer })
  public status: CodeStatus;

  // 40→48→56: zero padding ──────────────────────────────────────────────────

  @Column({ name: 'block_number', type: 'bigint' })
  public blockNumber: string;

  @Column({ type: 'timestamptz' })
  public timestamp: Date;

  // 56→60: 4-byte aligned, zero padding ─────────────────────────────────────

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
