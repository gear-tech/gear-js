import { Dns, DnsProgram } from 'gear-idea-indexer-db';
import type { DataSource, Repository } from 'typeorm';

import type {
  DnsContractResponse,
  DnsProgramResponse,
  GetDnsProgramsResponse,
  ParamGetDnsByAddress,
  ParamGetDnsByName,
  ParamGetDnsPrograms,
} from '../types/index.js';

const SORTABLE_FIELDS = new Set(['name', 'address', 'createdAt', 'updatedAt', 'createdBy']);

export class DnsService {
  private _programRepo: Repository<DnsProgram>;
  private _dnsRepo: Repository<Dns>;

  constructor(dataSource: DataSource) {
    this._programRepo = dataSource.getRepository(DnsProgram);
    this._dnsRepo = dataSource.getRepository(Dns);
  }

  async getDnsContract(): Promise<DnsContractResponse> {
    const dns = await this._dnsRepo.findOne({ where: {} });
    return { contract: dns?.address ?? null };
  }

  async getPrograms(params: ParamGetDnsPrograms): Promise<GetDnsProgramsResponse> {
    const qb = this._programRepo.createQueryBuilder('p');

    if (params.search) {
      qb.andWhere('(p.name ILIKE :search OR p.address ILIKE :search)', { search: `%${params.search}%` });
    }

    if (params.createdBy) {
      qb.andWhere('p.createdBy = :createdBy', { createdBy: params.createdBy });
    }

    const limit = params.limit !== undefined ? Number(params.limit) : 10;
    const offset = params.offset !== undefined ? Number(params.offset) : 0;

    qb.limit(limit).offset(offset);

    if (params.orderByField && SORTABLE_FIELDS.has(params.orderByField) && params.orderByDirection) {
      qb.addOrderBy(`p.${params.orderByField}`, params.orderByDirection);
    }

    const [programs, count] = await qb.getManyAndCount();

    return {
      data: programs.map(this._toDto),
      count,
    };
  }

  async getProgramByName({ name }: ParamGetDnsByName): Promise<DnsProgramResponse | null> {
    const program = await this._programRepo.findOneBy({ id: name });
    return this._toDto(program);
  }

  async getProgramByAddress({ address }: ParamGetDnsByAddress): Promise<DnsProgramResponse | null> {
    const program = await this._programRepo.findOneBy({ address });
    return this._toDto(program);
  }

  private _toDto(program: DnsProgram | null): DnsProgramResponse | null {
    if (!program) {
      return null;
    }

    return {
      id: program.id,
      name: program.name,
      address: program.address,
      admins: program.admins,
      createdBy: program.createdBy,
      createdAt: program.createdAt,
      updatedAt: program.updatedAt,
    };
  }
}
