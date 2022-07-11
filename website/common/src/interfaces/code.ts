import { CODE_STATUS } from '../enums';

interface ICode {
  id: string;
  name: string;
  status: CODE_STATUS;
  expiration?: number | null;
}

interface ICodeChangedData {
  id: string;
  change: string;
  expiration?: number | null;
}

export { ICode, ICodeChangedData };
