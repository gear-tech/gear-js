import { IsString, Contains } from 'class-validator';
import { ProgramStatus } from 'gear-idea-indexer-db';
import { ParamGenesis, ParamPagination } from './common';
import { IsOneOf } from '../../decorators';

export class ParamGetProgram extends ParamGenesis {
  @IsString()
  @Contains('0x')
  readonly id: string;
}

export class ParamGetPrograms extends ParamPagination {
  readonly owner?: string;
  readonly name?: string;
  readonly codeId?: string;
  readonly status?: ProgramStatus | ProgramStatus[];
  readonly query?: string;
}

export class ParamSetProgramMeta extends ParamGetProgram {
  readonly name?: string;
  @IsOneOf(['sails', 'meta'], false)
  readonly metaType?: 'sails' | 'meta';
}
