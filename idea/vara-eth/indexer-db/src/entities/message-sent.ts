import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import type { PgByteaString } from '../helpers/index.js';
import { Program } from './program.js';
import { StateTransition } from './state-transition.js';

@Index('idx_msg_sent_program_created_at', ['sourceProgramId', 'createdAt'])
@Index('idx_msg_sent_destination_created_at', ['destination', 'createdAt'])
@Entity('message_sent')
export class MessageSent {
  constructor(props?: Partial<MessageSent>) {
    Object.assign(this, props);
  }

  @PrimaryColumn()
  id: PgByteaString;

  @Column({ type: 'bytea', name: 'source_program_id' })
  sourceProgramId: PgByteaString;

  @ManyToOne(() => Program)
  @JoinColumn({ name: 'source_program_id' })
  sourceProgram?: Program;

  @Column({ type: 'bytea' })
  destination: PgByteaString;

  @Column({ type: 'bytea', name: 'state_transition_id' })
  stateTransitionId: PgByteaString;

  @ManyToOne(() => StateTransition)
  @JoinColumn({ name: 'state_transition_id' })
  stateTransition?: StateTransition;

  @Column({ type: 'bigint' })
  value: bigint;

  @Column({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'is_call', default: false })
  isCall: boolean;

  @Column({ type: 'bytea' })
  payload: PgByteaString;
}
