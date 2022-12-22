import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IState } from '@gear-js/common';

import { Code } from './code.entity';

@Entity()
export class State implements IState {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public name: string;

  @Column()
  public wasmBuffBase64: string;

  @Column({ type: 'json' })
  public funcNames: string[];

  @Column({ type: 'json' })
  public functions: JSON;

  @ManyToOne(() => Code, (code) => code.states, {
    nullable: true
  })
  @JoinColumn({ name: 'code_id' })
  public code: Code;
}
