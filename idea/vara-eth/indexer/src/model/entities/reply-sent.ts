import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { Program } from './program.js';
import { StateTransition } from './state-transition.js';

@Entity('reply_sent')
export class ReplySent {
  constructor(props?: Partial<ReplySent>) {
    Object.assign(this, props);
  }

  @PrimaryColumn({ type: 'bytea' })
  id: string;

  @Column({ type: 'bytea', name: 'replied_to_id' })
  repliedToId: Buffer;

  @Column({ type: 'varchar', length: 10, name: 'reply_code' })
  replyCode: string;

  @Column({ type: 'bytea', name: 'source_program_id' })
  sourceProgramId: Buffer;

  @ManyToOne(() => Program)
  @JoinColumn({ name: 'source_program_id' })
  sourceProgram?: Program;

  @Column({ type: 'bytea' })
  destination: Buffer;

  @Column({ type: 'bytea' })
  payload: Buffer;

  @Column({ type: 'bigint' })
  value: bigint;

  @Column({ name: 'is_call', default: false })
  isCall: boolean;

  @Column({ type: 'bytea', name: 'state_transition_id' })
  stateTransitionId: Buffer;

  @ManyToOne(() => StateTransition)
  @JoinColumn({ name: 'state_transition_id' })
  stateTransition?: StateTransition;

  @Column({ type: 'timestamp without time zone', name: 'created_at' })
  createdAt: Date;
}
