import { Column, Index } from 'typeorm';
import { IBaseDBRecord } from '@gear-js/common';

export abstract class BaseEntity implements IBaseDBRecord<Date> {
  @Index()
  @Column()
    genesis: string;

  @Column({ nullable: true })
    blockHash: string;

  @Column({ nullable: true, type: 'timestamp' })
    timestamp: Date;
}
