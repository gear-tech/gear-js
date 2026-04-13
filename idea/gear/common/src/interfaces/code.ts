import type { CodeStatus } from '../enums/index.js';

export interface ICode {
  id: string;
  uploadedBy: string;
  name: string;
  status: CodeStatus;
  expiration?: string | null;
  metahash?: string | null;
  hasState?: boolean;
}
