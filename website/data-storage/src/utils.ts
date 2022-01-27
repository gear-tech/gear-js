import { Logger } from '@nestjs/common';
import { PAGINATION_LIMIT } from './config/configuration';
import { IPaginationParams } from '@gear-js/interfaces';

export class ErrorLogger {
  logger: Logger;

  constructor(context: string) {
    this.logger = new Logger(context);
  }

  error(error: any, line: number | string) {
    console.log('===>');
    this.logger.error(`Error: ${error}`, `Stack: ${error.stack}`, `Line: ${line}`, '');
    console.log('<===');
  }
}

export function getPaginationParams(params: IPaginationParams): { take: number; skip: number } {
  return { take: params.limit || PAGINATION_LIMIT, skip: params.offset || 0 };
}
