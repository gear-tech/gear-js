import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class RouterImplementation {
  constructor(props?: Partial<RouterImplementation>) {
    Object.assign(this, props);
  }

  // Lowercase hex address of the implementation contract (from Upgraded event).
  // Used as the entity id to satisfy the Subsquid store's Entity constraint.
  @PrimaryColumn()
  id: string;

  // First block at which this implementation became active.
  @Column({
    name: 'from_block',
    type: 'bigint',
    transformer: { to: (v: bigint) => v.toString(), from: (v: string) => BigInt(v) },
  })
  fromBlock: bigint;

  // ABI version string — must match a key in ROUTER_VERSION_TO_ABI.
  @Column()
  version: string;
}
