import { IsDateString } from 'class-validator';
import { ParamGenesis, ParamPagination } from './common';

export interface ParamGetEvent extends ParamGenesis {
  id: string;
}

export class ParamGetEvents extends ParamPagination {
  readonly service?: string;
  readonly name?: string;
  readonly source?: string;
  readonly parentId?: string;
  @IsDateString()
  readonly from?: string;
  @IsDateString()
  readonly to?: string;
}
