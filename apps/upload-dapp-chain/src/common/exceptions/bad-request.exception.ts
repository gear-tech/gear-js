import { BadRequestException } from "@nestjs/common";

import { ErrorCode } from "./error-code";

export class BadRequestExc extends BadRequestException {
  constructor(message: string) {
    super(message, ErrorCode.BAD_REQUEST);
  }
}
