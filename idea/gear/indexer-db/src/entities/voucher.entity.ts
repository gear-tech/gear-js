import { Column, Entity, PrimaryColumn } from 'typeorm';

import { hexToBytea } from '../transformers.js';

@Entity()
export class Voucher {
  constructor(props?: Voucher) {
    Object.assign(this, props);
  }

  @PrimaryColumn({ type: 'bytea', transformer: hexToBytea })
  id!: string;

  @Column({ type: 'bytea', transformer: hexToBytea })
  owner!: string;

  @Column({ type: 'bytea', transformer: hexToBytea })
  spender!: string;

  @Column('bigint')
  amount!: bigint;

  @Column('bigint')
  balance!: bigint;

  @Column('jsonb', { default: [] })
  programs?: string[];

  @Column({ name: 'code_uploading' })
  codeUploading!: boolean;

  @Column('bigint', { name: 'duration' })
  expiryAtBlock!: bigint;

  @Column('timestamp without time zone', { name: 'expiry_at' })
  expiryAt!: Date;

  @Column('bigint', { name: 'issued_at_block' })
  issuedAtBlock!: bigint;

  @Column('timestamp without time zone', { name: 'issued_at' })
  issuedAt!: Date;

  @Column('bigint', { name: 'updated_at_block' })
  updatedAtBlock!: bigint;

  @Column('timestamp without time zone', { name: 'created_at' })
  updatedAt!: Date;

  @Column({ name: 'is_declined', default: false })
  isDeclined?: boolean;
}
