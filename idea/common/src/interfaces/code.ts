import { CodeStatus } from '../enums';

export interface ICode {
  _id: string;
  id: string;
  name: string;
  status: CodeStatus;
  expiration?: string | null;
}
