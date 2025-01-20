import { IsNotEmpty } from 'class-validator';

export class ParamGenesis {
  @IsNotEmpty()
  readonly genesis: string;
}

export class ParamPagination extends ParamGenesis {
  public limit?: number;
  public offset?: number;
}
