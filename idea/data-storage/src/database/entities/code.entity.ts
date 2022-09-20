import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CODE_STATUS, ICode } from '@gear-js/common';

import { BaseEntity } from './base.entity';

@Entity()
export class Code extends BaseEntity implements ICode {
  @PrimaryGeneratedColumn('uuid')
    _id: string;

  @Column()
    id: string;

  @Column()
    name: string;

  @Column({ type: 'enum', enum: CODE_STATUS })
    status: CODE_STATUS;

  @Column({ nullable: true })
    expiration: number;
}
