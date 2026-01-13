import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ethereum_tx')
export class EthereumTx {
  constructor(props?: Partial<EthereumTx>) {
    Object.assign(this, props);
  }

  @PrimaryColumn()
  id: string;

  @Column({ name: 'contract_address', type: 'bytea' })
  contractAddress: Buffer;

  @Column({ type: 'varchar', length: 10 })
  selector: string;

  @Column({ type: 'bytea' })
  data: Buffer;

  @Column({ type: 'bytea' })
  sender: Buffer;

  @Column({ type: 'bigint', name: 'block_number' })
  blockNumber: bigint;

  @Column({ type: 'timestamp without time zone', name: 'created_at' })
  createdAt: Date;
}
