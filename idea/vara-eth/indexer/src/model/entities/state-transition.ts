import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { Program } from './program.js';
import { Batch } from './batch.js';

@Entity('state_transition')
export class StateTransition {
  constructor(props?: Partial<StateTransition>) {
    Object.assign(this, props);
  }

  @PrimaryColumn({ type: 'bytea' })
  id: string;

  @Column({ type: 'bytea' })
  hash: Buffer;

  @ManyToOne(() => Batch)
  @JoinColumn({ name: 'batch_hash' })
  batch: Batch;

  @Column({ type: 'timestamp without time zone' })
  timestamp: Date;

  @Column({ type: 'bytea', name: 'program_id' })
  programId: Buffer;

  @ManyToOne(() => Program)
  @JoinColumn({ name: 'program_id' })
  program?: Program;

  @Column({ default: false })
  exited: boolean;

  @Column({ nullable: true, type: 'bytea' })
  inheritor?: Buffer | null;

  @Column({ type: 'bigint', name: 'value_to_receive', nullable: true })
  valueToReceive: bigint;

  // TODO: valueClaims
  // TODO: messages
}
