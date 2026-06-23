import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import type { PgByteaString } from '../helpers/index.js';
import { Batch } from './batch.js';
import { Program } from './program.js';

@Index('idx_state_transition_program_timestamp', ['programId', 'createdAt'])
@Index('idx_state_transition_timestamp', ['createdAt'])
@Entity('state_transition')
export class StateTransition {
  constructor(props?: Partial<StateTransition>) {
    Object.assign(this, props);
  }

  @PrimaryColumn()
  id: PgByteaString;

  @Column({ type: 'bytea' })
  hash: PgByteaString;

  @ManyToOne(() => Batch)
  @JoinColumn({ name: 'batch_hash' })
  batch: Batch;

  @Column({ type: 'bytea', name: 'program_id' })
  programId: PgByteaString;

  @ManyToOne(() => Program)
  @JoinColumn({ name: 'program_id' })
  program?: Program;

  @Column({ type: 'bigint', name: 'value_to_receive', nullable: true })
  valueToReceive: bigint | null;

  @Column({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @Column({ default: false })
  exited: boolean;

  @Column({ nullable: true, type: 'bytea' })
  inheritor?: PgByteaString | null;

  // TODO: add timestamp field
  // TODO: valueClaims
  // TODO: messages
}
