import { Column, Entity, Index, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { ICode } from '@gear-js/common';

import { BaseEntity } from './base.entity';
import { CodeStatus } from '../../common/enums';

@Entity()
export class Code extends BaseEntity implements ICode {
  constructor(props: Code) {
    super();
    Object.assign(this, props);
  }

  @PrimaryGeneratedColumn('uuid')
  public _id?: string;

  @Index()
  @Column()
  public id: string;

  @Column()
  public uploadedBy: string;

  @Index()
  @Column()
  public name: string;

  @Column({ type: 'enum', enum: CodeStatus })
  public status: CodeStatus;

  @Column({ nullable: true })
  public expiration?: string;

  @Column({ nullable: true })
  public metahash?: string;

  @Column({ default: false })
  public hasState?: boolean;
}
