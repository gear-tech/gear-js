import { Entity, PrimaryColumn, Column } from 'typeorm';

export enum CodeStatus {
  ValidationRequested,
  ValidationFailed,
  Validated,
}

@Entity()
export class Code {
  constructor(props?: Partial<Code>) {
    Object.assign(this, props);
  }

  @PrimaryColumn({ type: 'bytea' })
  id: string;

  @Column({ default: CodeStatus.ValidationRequested, enum: CodeStatus, type: 'enum' })
  status: number;

  @Column({ name: 'created_at', type: 'timestamp without time zone' })
  createdAt: Date;
}
