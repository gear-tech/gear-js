import { IBaseDBRecord } from '@gear-js/interfaces';
import { Column, Index } from 'typeorm';

export abstract class BaseEntity implements IBaseDBRecord<Date> {
  @Index()
  @Column()
  genesis: string;

  @Column({ nullable: true })
  blockHash: string;

  @Column({ nullable: true })
  timestamp: Date;
}
