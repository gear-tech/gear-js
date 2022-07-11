import { ExecutionError } from 'src/common/errors/interfaces';

export type Result<T> = Promise<T | ExecutionError>;
