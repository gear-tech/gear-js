import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class TransferBalance {
  constructor(props: TransferBalance) {
    Object.assign(this, props);
  }

  @PrimaryColumn()
  account: string;

  @Column()
  lastTransfer: Date;
}
