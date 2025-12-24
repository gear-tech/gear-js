import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { Code } from './code.js';

@Entity({ name: 'program' })
export class Program {
  constructor(props?: Partial<Program>) {
    Object.assign(this, props);
  }

  @PrimaryColumn({ type: 'bytea' })
  id: string;

  @Column({ type: 'bytea', name: 'code_id' })
  codeId: Buffer;

  @ManyToOne(() => Code)
  @JoinColumn({ name: 'code_id' })
  code?: Code;

  @Column('bigint', { name: 'created_at_block' })
  blockNumber: bigint;

  @Column({ name: 'created_at_tx_hash', type: 'bytea' })
  txHash: Buffer;

  @Column({ name: 'abi_interface_address', nullable: true, type: 'bytea' })
  abiInterfaceAddress?: Buffer | null;

  @Column({ name: 'created_at', type: 'timestamp without time zone' })
  createdAt: Date;
}
