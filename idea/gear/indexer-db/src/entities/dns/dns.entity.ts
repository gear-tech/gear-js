import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ schema: 'dns' })
export class Dns {
  constructor(props?: Partial<Dns>) {
    Object.assign(this, props);
  }

  @PrimaryColumn({ type: 'varchar' })
  public id: string;

  @Column({ type: 'varchar' })
  public address: string;
}
