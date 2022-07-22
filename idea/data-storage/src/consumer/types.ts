import { ExecutionError } from '../common/errors/interfaces';

export type Result<T> = Promise<T | ExecutionError>;
