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

    qb.limit(limit)
      .offset(offset)
      .orderBy('p.updatedAt', params.sort === 'asc' ? 'ASC' : 'DESC');

    const [programs, count] = await qb.getManyAndCount();

    return {
      data: programs.map((p) => this._toDto(p)),
      count,
    };
  }

  async getProgramByName({ name }: ParamGetDnsByName): Promise<DnsProgramResponse | null> {
    const program = await this._programRepo.findOneBy({ id: name });
    return program ? this._toDto(program) : null;
  }

  async getProgramByAddress({ address }: ParamGetDnsByAddress): Promise<DnsProgramResponse | null> {
    const program = await this._programRepo.findOneBy({ address });
    return program ? this._toDto(program) : null;
  }

  private _toDto(program: DnsProgram): DnsProgramResponse {
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
