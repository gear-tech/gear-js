import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

import { hexToBytea } from '../transformers.js';

@Entity()
export class Event {
  constructor(props?: Partial<Event>) {
    Object.assign(this, props);
  }

  @PrimaryColumn({ type: 'bytea', transformer: hexToBytea })
  public id: string;

  // ── 8-byte fixed ──────────────────────────────────────────────────────────

  @Column({ name: 'block_number', type: 'bigint' })
  public blockNumber: string;

  @Column({ type: 'timestamptz' })
  public timestamp: Date;

  // ── variable-length ───────────────────────────────────────────────────────

  @Index()
  @Column({ type: 'bytea', transformer: hexToBytea })
  public source: string;

  @Column({ type: 'bytea', nullable: true, name: 'parent_id', transformer: hexToBytea })
  public parentId: string | null;

  @Column({ nullable: true, name: 'block_hash', type: 'bytea', transformer: hexToBytea })
  public blockHash: string;

  @Column({ type: 'bytea', nullable: true, transformer: hexToBytea })
  public payload: string | null;

  @Column({ nullable: true })
  public service?: string | null;

  @Column({ nullable: true })
  public name?: string | null;
}
