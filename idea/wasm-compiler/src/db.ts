import { Repository, DataSource } from 'typeorm';
import { CompileStatus, Wasm } from './entity';
import config from './configuration';

export class DBService {
  repo: Repository<Wasm>;
  dataSource: DataSource;

  constructor() {
    this.dataSource = new DataSource({
      type: 'postgres',
      host: config.db.host,
      port: config.db.port,
      username: config.db.user,
      password: config.db.password,
      database: config.db.name,
      synchronize: true,
      entities: [Wasm],
    });
  }

  async connect() {
    await this.dataSource.initialize();
    this.repo = this.dataSource.getRepository(Wasm);
    console.log('Connected to DB');
  }

  newBuild(id: string): Promise<Wasm> {
    const created = this.repo.create({ id });
    return this.repo.save(created);
  }

  update(id: string, file?: Buffer, error?: string): void {
    const status = file ? CompileStatus.Done : CompileStatus.Failed;
    this.repo.update({ id }, { file, status, error });
  }

  async getFile(id: string): Promise<Wasm> {
    const wasm = await this.repo.findOneBy({ id });
    if (
      wasm.status === CompileStatus.Done ||
      wasm.status === CompileStatus.Failed
    ) {
      return this.repo.remove(wasm);
    }
    return wasm;
  }
}
