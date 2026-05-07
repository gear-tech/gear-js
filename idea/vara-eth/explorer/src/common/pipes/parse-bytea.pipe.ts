import { Injectable, type PipeTransform } from '@nestjs/common';
import type { PgByteaString } from '@vara-eth/idea-indexer-db';

import { toBytea } from '../utils/hex.util.js';

@Injectable()
export class ParseByteaPipe implements PipeTransform<string, PgByteaString> {
  transform(value: string): PgByteaString {
    return toBytea(value);
  }
}
