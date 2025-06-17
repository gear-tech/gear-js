import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class UserLastSeen {
  constructor(id: string) {
    this.id = id;
    this.timestamp = new Date();
  }

  @PrimaryColumn()
  public id: string;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  public timestamp: Date;
}
