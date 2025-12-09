import { Entity, PrimaryColumn, Column } from 'typeorm';

export enum EntityType {
  Program = 'prog',
  Code = 'code',
}

@Entity('hash_registry')
export class HashRegistry {
  constructor(props?: Partial<HashRegistry>) {
    Object.assign(this, props);
  }

  @PrimaryColumn()
  id: string;

  @Column('varchar')
  type: EntityType;

  @Column('timestamp', { name: 'created_at' })
  createdAt: Date;
}
