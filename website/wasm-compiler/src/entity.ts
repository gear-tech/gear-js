import { Column, Entity, PrimaryColumn } from 'typeorm';

export enum CompileStatus {
  InProcess,
  Failed,
  Done,
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
    default: CompileStatus.InProcess,
  })
  status: CompileStatus;

  @Column({ nullable: true })
  error: string;
}
