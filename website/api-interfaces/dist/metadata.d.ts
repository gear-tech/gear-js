import { RequestParams } from './general';
export interface Meta {
  id: string;
  program: string;
  owner: string;
}
export interface AddMetaParams extends RequestParams {
  programId: string;
  signature: string;
  meta: string | any;
  metaFile: string;
  name?: string;
  title?: string;
}
export interface AddMetaResult {
  status: 'Metadata added';
}
export interface GetMetaParams extends RequestParams {
  programId: string;
}
export interface GetMetaResult {
  program: string;
  meta: string;
  metaFile: string;
}
