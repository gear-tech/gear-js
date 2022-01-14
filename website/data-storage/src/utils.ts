import { Logger } from '@nestjs/common';

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
