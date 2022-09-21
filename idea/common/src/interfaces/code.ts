import { CodeStatus } from '../enums';

interface ICode {
  id: string;
  name: string;
  status: CodeStatus;
  expiration?: number | null;
}

interface ICodeChangedData {
  id: string;
  change: string;
  expiration?: number | null;
}

export { ICode, ICodeChangedData };
