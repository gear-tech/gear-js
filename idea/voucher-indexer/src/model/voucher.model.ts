import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Voucher {
  constructor(props?: Voucher) {
    Object.assign(this, props);
  }

  @PrimaryColumn()
  id!: string;

  @Column()
  owner!: string;

  @Column()
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
