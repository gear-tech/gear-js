import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import type { PgByteaString } from '../helpers/index.js';
import { Program } from './program.js';
import { StateTransition } from './state-transition.js';

@Index('idx_reply_sent_destination_created_at', ['destination', 'createdAt'])
@Index('idx_reply_sent_program_created_at', ['sourceProgramId', 'createdAt'])
@Entity('reply_sent')
export class ReplySent {
  constructor(props?: Partial<ReplySent>) {
    Object.assign(this, props);
  }

  @PrimaryColumn({ type: 'bytea' })
  id: PgByteaString;

  @Column({ type: 'bytea', name: 'replied_to_id' })
  repliedToId: PgByteaString;

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

  @Column({ type: 'varchar', length: 10, name: 'reply_code' })
  replyCode: string;

  @Column({ name: 'is_call', default: false })
  isCall: boolean;

  @Column({ type: 'bigint' })
  value: bigint;

  @Column({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'bytea' })
  payload: PgByteaString;
}
