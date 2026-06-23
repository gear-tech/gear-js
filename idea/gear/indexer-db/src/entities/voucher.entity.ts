import { Column, Entity, PrimaryColumn } from 'typeorm';

import { hexToBytea } from '../transformers.js';
import type { Hex } from '../types.js';

@Entity()
export class Voucher {
  constructor(props?: Voucher) {
    Object.assign(this, props);
  }

  @PrimaryColumn({ type: 'varchar', length: 66 })
  id!: string;

  @Column({ name: 'code_uploading' })
  codeUploading!: boolean;

  @Column({ name: 'is_declined', default: false })
  isDeclined?: boolean;

  @Column({ type: 'numeric' })
  amount!: string;

  @Column({ type: 'numeric' })
  balance!: string;

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
