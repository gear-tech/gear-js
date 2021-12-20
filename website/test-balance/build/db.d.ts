import { Connection, Repository } from 'typeorm';
import { TransferBalance } from './transfer.entity';
export declare class DbService {
  connection: Connection;
  repo: Repository<TransferBalance>;
  connect(): Promise<void>;
  setTransferDate(account: string, genesis: string): Promise<TransferBalance>;
  possibleToTransfer(account: string, genesis: string): Promise<boolean>;
}
