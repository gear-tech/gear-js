import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

import type { PgByteaString } from '../helpers/index.js';

export enum CodeStatus {
  ValidationRequested = 0,
  ValidationFailed = 1,
  Validated = 2,
}

@Index('idx_code_created_at', ['createdAt'])
@Entity()
export class Code {
  constructor(props?: Partial<Code>) {
    Object.assign(this, props);
  }

  @PrimaryColumn()
  id: PgByteaString;

  @Column({ default: CodeStatus.ValidationRequested, enum: CodeStatus, type: 'enum' })
  status: number;

  @Column({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
