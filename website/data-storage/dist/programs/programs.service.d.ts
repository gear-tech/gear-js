import { Meta } from 'src/metadata/entities/meta.entity';
import { Repository } from 'typeorm';
import { InitStatus, Program } from './entities/program.entity';
import { FindProgramParams, GetAllProgramsParams, GetAllProgramsResult } from '@gear-js/backend-interfaces';
export declare class ProgramsService {
  private readonly programRepo;
  constructor(programRepo: Repository<Program>);
  save({
    id,
    chain,
    genesis,
    owner,
    uploadedAt,
  }: {
    id: any;
    chain: any;
    genesis: any;
    owner: any;
    uploadedAt: any;
  }): Promise<Program>;
  addProgramInfo(
    id: string,
    chain: string,
    genesis: string,
    name?: string,
    title?: string,
    meta?: Meta,
  ): Promise<Program>;
  getAllUserPrograms(params: GetAllProgramsParams): Promise<GetAllProgramsResult>;
  getAllPrograms(params: GetAllProgramsParams): Promise<GetAllProgramsResult>;
  findProgram(params: FindProgramParams): Promise<Program>;
  setStatus(id: string, chain: string, genesis: string, status: InitStatus): Promise<Program>;
  isInDB(id: string, chain: string, genesis: string): Promise<boolean>;
}
