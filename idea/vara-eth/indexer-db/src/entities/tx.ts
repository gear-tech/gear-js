import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

import type { PgByteaString } from '../helpers/index.js';

@Index('idx_eth_tx_sender_created_at', ['sender', 'createdAt'])
@Index('idx_eth_tx_created_at', ['createdAt'])
@Entity('ethereum_tx')
export class EthereumTx {
  constructor(props?: Partial<EthereumTx>) {
    Object.assign(this, props);
  }

  @PrimaryColumn({ type: 'bytea' })
  id: PgByteaString;

  @Column({ type: 'bytea', name: 'contract_address' })
  contractAddress: PgByteaString;

  @Column({ type: 'bytea' })
  sender: PgByteaString;

  @Column({ type: 'bytea' })
  selector: PgByteaString;

  @Column({ type: 'bigint', name: 'block_number' })
  blockNumber: bigint;

  @Column({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'bytea' })
  data: PgByteaString;
}
