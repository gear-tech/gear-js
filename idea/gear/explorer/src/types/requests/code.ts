import { CodeStatus, MetaType } from 'gear-idea-indexer-db';
import { IsNotEmpty, IsString } from 'class-validator';
import { IsOneOf } from '../../decorators';
import { ParamGenesis, ParamPagination } from './common';

export class ParamGetCode extends ParamGenesis {
  @IsString()
  @IsNotEmpty()
  readonly id: string;
}

export class ParamGetCodes extends ParamPagination {
  readonly uploadedBy?: string;
  readonly name?: string;
  @IsOneOf(Object.values(CodeStatus), false)
  readonly status?: CodeStatus | CodeStatus[];
  readonly query?: string;
}

export class ParamSetCodeMeta extends ParamGetCode {
  readonly name?: string;
  @IsOneOf(['sails', 'meta'], false)
  readonly metaType?: MetaType;
}
