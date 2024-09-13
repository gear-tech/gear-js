import { IsString, Contains } from 'class-validator';
import { MessageEntryPoint } from 'indexer-db';
import { ParamGenesis, ParamPagination } from './common';
import { IsOneOf } from '../../decorators';

export class ParamMsgToProgram extends ParamGenesis {
  @IsString()
  @Contains('0x')
  readonly id: string;
}

export class ParamMsgFromProgram extends ParamMsgToProgram {}

export class ParamGetMsgsToProgram extends ParamPagination {
  readonly destination?: string;
  readonly source?: string;
  @IsOneOf(Object.values(MessageEntryPoint), false)
  readonly entry?: MessageEntryPoint;
  readonly service?: string;
  readonly fn?: string;
}

export class ParamGetMsgsFromProgram extends ParamPagination {
  readonly destination?: string;
  readonly source?: string;
  readonly parentId?: string;
  readonly isInMailbox?: boolean;
  readonly service?: string;
  readonly fn?: string;
}
