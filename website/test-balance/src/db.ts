import { Connection, createConnection, getRepository, Repository } from 'typeorm';
import config from './config';
import { TransferBalance } from './transfer.entity';
import { Logger } from './logger';

const log = Logger('DbService');

export class DbService {
  connection: Connection;
  repo: Repository<TransferBalance>;

  async connect() {
    this.connection = await createConnection({
      type: 'postgres',
      host: config.db.host,
      port: config.db.port,
      database: config.db.name,
      username: config.db.user,
      password: config.db.password,
      entities: [TransferBalance],
      synchronize: true,
    });
    this.repo = getRepository(TransferBalance);
    log.info('Connected to database');
  }

  async setTransferDate(account: string, genesis: string) {
    const transfer = this.repo.create({
      account: `${account}.${genesis}`,
      lastTransfer: new Date(),
    });
    return await this.repo.save(transfer);
  }

  async possibleToTransfer(account: string, genesis: string) {
    console.log(`${account}.${genesis}`);
    const transfer = await this.repo.findOne({ account: `${account}.${genesis}` });
    console.log(transfer);
    if (!transfer) {
      return true;
    }
    console.log(transfer.lastTransfer.setHours(0, 0, 0, 0));
    console.log(new Date().setHours(0, 0, 0, 0));
    console.log(transfer.lastTransfer.setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0));
    if (transfer.lastTransfer.setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)) {
      return true;
    }
    return false;
  }
}
