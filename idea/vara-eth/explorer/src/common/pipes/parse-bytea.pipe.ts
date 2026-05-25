import { BadRequestException, Injectable, type PipeTransform } from '@nestjs/common';
import type { PgByteaString } from '@vara-eth/idea-indexer-db';

import { toBytea } from '../utils/hex.util.js';

const HEX_PATTERN = /^(0x)?[0-9a-fA-F]+$/;

@Injectable()
export class ParseByteaPipe implements PipeTransform<string, PgByteaString> {
  transform(value: string): PgByteaString {
    if (!HEX_PATTERN.test(value)) {
      throw new BadRequestException(`Invalid hex string: ${value}`);
    }
    return toBytea(value);
  }
}
