import { Column } from 'typeorm';

import { hexToBytea } from '../transformers.js';

export abstract class BaseEntity {
  @Column({ nullable: true, name: 'block_hash', type: 'bytea', transformer: hexToBytea })
  public blockHash: string;

  @Column({ nullable: false, name: 'block_number', type: 'bigint' })
  public blockNumber: string;

  // BRIN indexes on timestamp are added manually in the migration:
  // CREATE INDEX CONCURRENTLY ON <table> USING brin (timestamp);
  @Column({ type: 'timestamp' })
  public timestamp: Date;
}
