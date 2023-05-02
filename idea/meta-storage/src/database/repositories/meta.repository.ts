import { dataSource } from '../data-source';
import { Meta } from '../entities/';

const metaRepo = dataSource.getRepository(Meta);

export const metaRepository = {
  async save(meta: Meta): Promise<Meta> {
    return metaRepo.save(meta);
  },
  async get(id: string): Promise<Meta> {
    return metaRepo.findOne({ where: { id } });
  },
};
