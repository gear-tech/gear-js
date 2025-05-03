import { Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class UserLastSeen {
  constructor(id: string) {
    Object.assign(this, { id });
  }

  @PrimaryColumn()
  public id: string;

  @UpdateDateColumn({ type: 'timestamptz' })
  public timestamp: Date;
}
