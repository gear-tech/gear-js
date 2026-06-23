import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { isValidAddress } from '../validators/index.js';
import { FaucetType, RequestStatus } from './enums.js';

@Entity()
export class FaucetRequest {
  constructor(props: Partial<FaucetRequest>) {
    Object.assign(this, props);
  }

  @PrimaryGeneratedColumn('increment')
  public id: number;

  @Column({ type: 'enum', enum: FaucetType })
  public type: FaucetType;

  @Column()
  @isValidAddress({ message: 'Invalid account address' })
  public address: `0x${string}`;

  @Column()
  public target: `0x${string}`;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  public timestamp: Date;

  @Column({ type: 'enum', enum: RequestStatus, default: RequestStatus.Pending })
  public status: RequestStatus;
}
