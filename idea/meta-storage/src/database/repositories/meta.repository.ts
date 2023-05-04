import { dataSource } from '../data-source';
import { Meta } from '../entities/meta.entity';

const metaRepo = dataSource.getRepository(Meta);

export const metaRepository = {
  async save(meta: Meta): Promise<Meta> {
    return metaRepo.save(meta);
  },
  async get(hash: string): Promise<Meta> {
    return metaRepo.findOneBy({ hash });
  },
};
