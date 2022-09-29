import { ExecutionError } from '../common/errors/interfaces';

export type Result<T> = Promise<T | ExecutionError>;

export interface ServicePartitionData {
  partition: string;
  genesis: string;
}
