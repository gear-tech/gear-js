import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'program' })
export class Program {
  constructor(props: Partial<Program>) {
    Object.assign(this, props);
  }

  @PrimaryColumn({ type: 'varchar', length: 42 })
  id: string;

  @Column({ name: 'code_id', type: 'varchar', length: 66 })
  codeId: string;

  @Column('bigint', { name: 'created_at_block' })
  blockNumber: bigint;

  @Column({ name: 'created_at_tx', type: 'varchar', length: 66 })
  txHash: string;

  @Column({ name: 'abi_interface_address', nullable: true, type: 'varchar', length: 42 })
  abiInterfaceAddress?: string | null;

  @Column({ name: 'created_at', type: 'timestamp without time zone' })
  createdAt: Date;
}
