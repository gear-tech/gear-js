import { Column, Entity, PrimaryColumn } from 'typeorm';

export enum CompileStatus {
  InProgress = 'InProgress',
  Failed = 'Failed',
  Done = 'Done',
}

@Entity()
export class Wasm {
  @PrimaryColumn()
  id: string;

  @Column({ type: 'bytea', nullable: true })
  file: Buffer;

  @Column({
    type: 'enum',
    enum: CompileStatus,
    default: CompileStatus.InProgress,
  })
  status: CompileStatus;

  @Column({ nullable: true })
  error: string;
}
