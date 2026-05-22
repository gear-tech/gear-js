import { IsNotEmpty, IsString } from 'class-validator';
import type { MetaType } from 'gear-idea-indexer-db';

import { IsOneOf } from '../../decorators/index.js';
import { ParamGenesis, ParamPagination } from './common.js';

export class ParamGetCode extends ParamGenesis {
  @IsString()
  @IsNotEmpty()
  readonly id: string;
}

const CODE_STATUSES = ['Active', 'Inactive', 'Unknown'] as const;
export type CodeStatusString = (typeof CODE_STATUSES)[number];

export class ParamGetCodes extends ParamPagination {
  readonly uploadedBy?: string;
  readonly name?: string;
  @IsOneOf(CODE_STATUSES as unknown as string[], false)
  readonly status?: CodeStatusString | CodeStatusString[];
  readonly query?: string;
}

export class ParamSetCodeMeta extends ParamGetCode {
  readonly name?: string;
  @IsOneOf(['sails', 'meta'], false)
  readonly metaType?: MetaType;
}
