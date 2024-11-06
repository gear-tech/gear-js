import { IsString, Contains } from 'class-validator';
import { ParamPagination } from './common';

export class ParamGetVoucher extends ParamPagination {
  @IsString()
  @Contains('0x')
  readonly id: string;
}

export class ParamGetVouchers extends ParamPagination {
  @IsString()
  @Contains('0x')
  readonly id?: string;
  readonly owner?: string;
  readonly spender?: string;
  readonly programs?: string[];
  readonly codeUploading?: boolean;
  readonly declined?: boolean;
  readonly expired?: boolean;
  readonly includeAllPrograms?: boolean;
}
