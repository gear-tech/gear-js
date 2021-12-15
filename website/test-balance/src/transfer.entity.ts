import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class TransferBalance {
  @PrimaryColumn()
  account: string;

  @Column()
  lastTransfer: Date;
}
