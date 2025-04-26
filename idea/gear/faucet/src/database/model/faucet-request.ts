import 'reflect-metadata';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { isValidAddress } from '../validators';
import { FaucetType, RequestStatus } from './enums';

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
  public address: string;

  @Column()
  public target: string;

  @Column({ type: 'time without time zone', default: () => 'CURRENT_TIMESTAMP' })
  public timestamp: Date;

  @Column({ type: 'enum', enum: RequestStatus, default: RequestStatus.Pending })
  public status: RequestStatus;
}
