import { Column, Entity, PrimaryColumn } from 'typeorm';
import { IMeta } from '@gear-js/common';

@Entity()
export class Meta implements IMeta {
  @PrimaryColumn()
  public id!: string; //hash

  @Column({ nullable: true })
  public hex!: string;

  @Column({ nullable: true, type: 'json' })
  public types!: any;
}
