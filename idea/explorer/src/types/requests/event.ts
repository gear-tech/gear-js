import { ParamGenesis, ParamPagination } from './common';

export interface ParamGetEvent extends ParamGenesis {
  id: string;
}

export interface ParamGetEvents extends ParamPagination, ParamGenesis {
  service?: string;
  name?: string;
  source?: string;
  parentId?: string;
}
