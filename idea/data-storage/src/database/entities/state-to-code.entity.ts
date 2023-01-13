import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Code } from './code.entity';
import { State } from './state.entity';

@Entity()
export class StateToCode {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public codeId!: string;

  @Column()
  public stateId!: string;

  @Column()
  public hexWasmState: string;

  @ManyToOne(() => Code, code => code.stateToCodes)
  public code!: Code;

  @ManyToOne(() => State, state => state.stateToCodes)
  public state!: State;
}
