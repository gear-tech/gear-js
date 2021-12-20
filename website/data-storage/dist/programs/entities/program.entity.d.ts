import { Meta } from 'src/metadata/entities/meta.entity';
export declare enum InitStatus {
  SUCCESS = 'success',
  FAILED = 'failed',
  PROGRESS = 'in progress',
}
export declare class Program {
  id: string;
  chain: string;
  genesis: string;
  owner: string;
  name: string;
  uploadedAt: Date;
  meta: Meta;
  title: string;
  initStatus: InitStatus;
}
