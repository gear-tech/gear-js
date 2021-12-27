import { ExecutionError } from 'src/errors/interfaces';

export type Result<T> = Promise<T | ExecutionError>;
