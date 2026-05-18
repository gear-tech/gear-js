import { Column, Entity, PrimaryColumn } from 'typeorm';

import { hexToBytea } from '../transformers.js';
import type { Hex } from '../types.js';

// Column order is tuned for PostgreSQL alignment.
// id (bytea) ends at offset 33. Two bools advance to 35; bigint needs 5-byte pad to reach 40.
// No int4 columns exist to do better — 5 bytes is the minimum with only bools available.

@Entity()
export class Voucher {
  constructor(props?: Voucher) {
    Object.assign(this, props);
  }

  @PrimaryColumn({ type: 'bytea', transformer: hexToBytea })
  id!: Hex;

  // 33→34→35: two bools, then 35→(5pad)→40: bigints start ──────────────────

  @Column({ name: 'code_uploading' })
  codeUploading!: boolean;

  @Column({ name: 'is_declined', default: false })
  isDeclined?: boolean;

  // 40→48→…→104: zero padding ───────────────────────────────────────────────

  @Column('bigint')
  amount!: bigint;

  @Column('bigint')
  balance!: bigint;

  @Column('bigint', { name: 'duration' })
  expiryAtBlock!: bigint;

  @Column('timestamptz', { name: 'expiry_at' })
  expiryAt!: Date;

  @Column('bigint', { name: 'issued_at_block' })
  issuedAtBlock!: bigint;

  @Column('timestamptz', { name: 'issued_at' })
  issuedAt!: Date;

  @Column('bigint', { name: 'updated_at_block' })
  updatedAtBlock!: bigint;

  @Column('timestamptz', { name: 'created_at' })
  updatedAt!: Date;

  // ── variable-length ───────────────────────────────────────────────────────

  @Column({ type: 'bytea', transformer: hexToBytea })
  owner!: Hex;

  @Column({ type: 'bytea', transformer: hexToBytea })
  spender!: Hex;

  @Column('jsonb', { default: [] })
  programs?: string[];
}
