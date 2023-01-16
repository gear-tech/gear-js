import { CodeStatus } from '../enums';

interface ICode {
  _id: string;
  id: string;
  name: string;
  status: CodeStatus;
  expiration?: string | null;
}

interface ICodeChangedData {
  id: string;
  change: string;
  expiration?: number | null;
}

export { ICode, ICodeChangedData };
