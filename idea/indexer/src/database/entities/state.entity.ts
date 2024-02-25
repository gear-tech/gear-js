import { Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { IState } from '@gear-js/common';
import { StateFunctions } from '@gear-js/api';

@Entity()
export class State implements IState {
  constructor(props: Partial<State>) {
    Object.assign(this, props);
  }

  @PrimaryColumn()
  public id: string;

  @Column()
  public name: string;

  @Column()
  public wasmBuffBase64: string;

  @Column({ type: 'json' })
  public funcNames: string[];

  @Column({ type: 'json' })
  public functions: StateFunctions;

  @Column({ name: 'code_id' })
  public codeId: string;
}
