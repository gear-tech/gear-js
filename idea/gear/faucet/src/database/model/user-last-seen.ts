import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class UserLastSeen {
  constructor(id: string) {
    Object.assign(this, { id });
  }

  @PrimaryColumn()
  public id: string;

  @Column({ name: 'timestamp', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  public timestamp: Date;
}
