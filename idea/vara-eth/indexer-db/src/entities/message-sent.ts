import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { Program } from './program.js';
import { StateTransition } from './state-transition.js';

@Entity('message_sent')
export class MessageSent {
  constructor(props?: Partial<MessageSent>) {
    Object.assign(this, props);
  }

  @PrimaryColumn()
  id: string;

  @Column({ name: 'source_program_id' })
  sourceProgramId: string;

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
  isCall: boolean; // TODO: figure out if it is possible that not reply message is call

  @Column({ name: 'state_transition_id' })
  stateTransitionId: string;

  @ManyToOne(() => StateTransition)
  @JoinColumn({ name: 'state_transition_id' })
  stateTransition?: StateTransition;

  @Column({ type: 'timestamp without time zone', name: 'created_at' })
  createdAt: Date;
}
