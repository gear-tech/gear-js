import { Meta } from '../../database/entities';

export interface CreateMetaInput {
  hash: string;
  types?: string | unknown;
  hex?: string;
}
