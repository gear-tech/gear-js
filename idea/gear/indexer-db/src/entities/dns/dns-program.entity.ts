import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity({ schema: 'dns' })
export class DnsProgram {
  constructor(props?: Partial<DnsProgram>) {
    Object.assign(this, props);
  }

  @PrimaryColumn({ type: 'varchar' })
  public id: string;

  @Column({ type: 'varchar' })
  public name: string;

  @Column({ type: 'varchar' })
  public address: string;

  @Column({ type: 'text', array: true })
  public admins: string[];

  @Column({ name: 'created_by', type: 'varchar' })
  public createdBy: string;

  @Index()
  @Column({ name: 'created_at', type: 'timestamptz' })
  public createdAt: Date;

  @Index()
  @Column({ name: 'updated_at', type: 'timestamptz' })
  public updatedAt: Date;
}
