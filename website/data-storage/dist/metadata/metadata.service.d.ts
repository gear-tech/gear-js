import { Repository } from 'typeorm';
import { ProgramsService } from '../programs/programs.service';
import { Meta } from './entities/meta.entity';
import { AddMetaParams, AddMetaResult, GetMetaParams, GetMetaResult } from '@gear-js/backend-interfaces';
export declare class MetadataService {
  private readonly metaRepo;
  private readonly programService;
  constructor(metaRepo: Repository<Meta>, programService: ProgramsService);
  addMeta(params: AddMetaParams): Promise<AddMetaResult>;
  getMeta(params: GetMetaParams): Promise<GetMetaResult>;
}
