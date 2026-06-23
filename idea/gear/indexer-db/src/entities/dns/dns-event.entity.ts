import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity({ schema: 'dns' })
export class DnsEvent {
  constructor(props?: Partial<DnsEvent>) {
    Object.assign(this, props);
  }

  @PrimaryColumn({ type: 'varchar', length: 36 })
  public id: string;

  @Column({ type: 'varchar' })
  public type: string;

  @Column({ type: 'text' })
  public raw: string;

  @Index()
  @Column({ name: 'block_number', type: 'bigint' })
  public blockNumber: string;

  @Column({ name: 'tx_hash', type: 'varchar', length: 66 })
  public txHash: string;

  @Column({ type: 'timestamptz' })
  public timestamp: Date;
}
