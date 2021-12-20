import { ExecutionError } from 'src/errors/interfaces';
export declare type Result<T> = Promise<T | ExecutionError>;
