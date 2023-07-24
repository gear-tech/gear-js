import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { IState } from '@gear-js/common';
import { StateToCode } from './state-to-code.entity';

@Entity()
export class State implements IState {
  constructor(props: Partial<State>) {
    Object.assign(this, props);
  }

  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public name: string;

  @Column()
  public wasmBuffBase64: string;

  @Column({ type: 'json' })
  public funcNames: string;

  @Column({ type: 'json' })
  public functions: string;

  @OneToMany(() => StateToCode, (stateToCode) => stateToCode.state)
  public stateToCodes!: StateToCode[];
}
