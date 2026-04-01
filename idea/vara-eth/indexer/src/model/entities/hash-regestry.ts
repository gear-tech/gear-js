import { Column, Entity, PrimaryColumn } from 'typeorm';

export enum EntityType {
  Announces = 0,
  Batch = 1,
  Code = 2,
  MessageRequest = 3,
  MessageSent = 4,
  Program = 5,
  StateTransition = 6,
  Tx = 7,
}

@Entity('hash_registry')
export class HashRegistry {
  constructor(props?: Partial<HashRegistry>) {
    Object.assign(this, props);
  }

  @PrimaryColumn()
  id: string;

  @Column({ type: 'enum', enum: EntityType })
  type: EntityType;

  @Column('timestamp', { name: 'created_at' })
  createdAt: Date;
}
