import { Column } from 'typeorm';

export abstract class BaseEntity {
  @Column({ nullable: true, name: 'block_hash', type: 'varchar', length: 66 })
  public blockHash: string;

  @Column({ nullable: false, name: 'block_number' })
  public blockNumber: string;

  @Column({ type: 'timestamp' })
  public timestamp: Date;
}
