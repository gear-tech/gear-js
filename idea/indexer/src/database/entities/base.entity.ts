import { Column, Index } from 'typeorm';
import { IBaseDBRecord } from '@gear-js/common';

export abstract class BaseEntity implements IBaseDBRecord<Date> {
  @Index()
  @Column()
  public genesis: string;

  @Column({ nullable: true })
  public blockHash: string;

  @Index()
  @Column({ type: 'timestamp' })
  public timestamp: Date;
}
