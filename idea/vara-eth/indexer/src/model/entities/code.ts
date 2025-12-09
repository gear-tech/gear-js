import { Entity, PrimaryColumn, Column } from 'typeorm';

export enum CodeStatus {
  ValidationRequested = 'validation_requested',
  ValidationFailed = 'validation_failed',
  Validated = 'validated',
}

@Entity()
export class Code {
  constructor(props?: Partial<Code>) {
    Object.assign(this, props);
  }

  @PrimaryColumn({ type: 'varchar', length: 66 })
  id: string;

  @Column('varchar')
  status: CodeStatus;

  @Column({ name: 'created_at', type: 'timestamp without time zone' })
  createdAt: Date;
}
