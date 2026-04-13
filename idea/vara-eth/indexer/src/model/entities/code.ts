import { Column, Entity, PrimaryColumn } from 'typeorm';

export enum CodeStatus {
  ValidationRequested = 0,
  ValidationFailed = 1,
  Validated = 2,
}

@Entity()
export class Code {
  constructor(props?: Partial<Code>) {
    Object.assign(this, props);
  }

  @PrimaryColumn()
  id: string;

  @Column({ default: CodeStatus.ValidationRequested, enum: CodeStatus, type: 'enum' })
  status: number;

  @Column({ name: 'created_at', type: 'timestamp without time zone' })
  createdAt: Date;
}
