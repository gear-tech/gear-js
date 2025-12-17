import { Entity, PrimaryColumn, Column } from 'typeorm';

export enum EntityType {
  Announces,
  Batch,
  Code,
  MessageRequest,
  MessageSent,
  Program,
  StateTransition,
  Tx,
}

@Entity('hash_registry')
export class HashRegistry {
  constructor(props?: Partial<HashRegistry>) {
    Object.assign(this, props);
  }

  @PrimaryColumn({ type: 'bytea' })
  id: string;

  @Column({ type: 'enum', enum: EntityType })
  type: EntityType;

  @Column('timestamp', { name: 'created_at' })
  createdAt: Date;
}
