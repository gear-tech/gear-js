import { Column, Entity, PrimaryColumn } from 'typeorm';

import { BaseEntity } from './base.entity';
import { CodeStatus, MetaType } from '../enums';

@Entity()
export class Code extends BaseEntity {
  constructor(props?: Partial<Code>) {
    super();
    Object.assign(this, props);
  }

  @PrimaryColumn()
  public id: string;

  @Column({ name: 'uploaded_by', nullable: true })
  public uploadedBy: string;

  @Column({ nullable: true })
  public name: string;

  @Column({ type: 'text' })
  public status: CodeStatus;

  @Column({ nullable: true })
  public expiration?: string;

  @Column({ nullable: true, name: 'meta_type' })
  public metaType?: MetaType | null;

  // TODO: remove later
  @Column({ nullable: true })
  public metahash?: string | null;
}
