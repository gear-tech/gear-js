import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import type { PgByteaString } from '../helpers/index.js';
import { Code } from './code.js';

@Index('idx_program_code_created_at', ['codeId', 'createdAt'])
@Index('idx_program_created_at', ['createdAt'])
@Entity({ name: 'program' })
export class Program {
  constructor(props?: Partial<Program>) {
    Object.assign(this, props);
  }

  @PrimaryColumn({ type: 'bytea' })
  id: PgByteaString;

  @Column({ type: 'bytea', name: 'code_id' })
  codeId: PgByteaString;

  @ManyToOne(() => Code)
  @JoinColumn({ name: 'code_id' })
  code?: Code;

  @Column({ type: 'bytea', name: 'created_at_tx_hash' })
  txHash: PgByteaString;

  @Column({ type: 'bytea', name: 'abi_interface_address', nullable: true })
  abiInterfaceAddress?: PgByteaString | null;

  @Column('bigint', { name: 'created_at_block' })
  blockNumber: bigint;

  @Column({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
