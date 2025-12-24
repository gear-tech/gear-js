import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { toHexString, bigIntToString } from '../utils/hex.util.js';

/**
 * Transforms entity data for client consumption:
 * - Converts bytea fields from \x to 0x prefix
 * - Converts bigint to string for JSON serialization
 */
@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((data) => this.transformData(data)));
  }

  private transformData(data: any): any {
    if (data === null || data === undefined) {
      return data;
    }

    if (Array.isArray(data)) {
      return data.map((item) => this.transformData(item));
    }

    if (typeof data === 'object') {
      // Handle paginated response
      if ('data' in data && Array.isArray(data.data)) {
        return {
          ...data,
          data: this.transformData(data.data),
        };
      }

      const transformed: any = {};
      for (const [key, value] of Object.entries(data)) {
        transformed[key] = this.transformValue(key, value);
      }
      return transformed;
    }

    return data;
  }

  private transformValue(_key: string, value: any): any {
    if (value === null || value === undefined) {
      return value;
    }

    // Transform bytea fields (Buffer objects)
    if (Buffer.isBuffer(value)) {
      return toHexString(value);
    }

    // Transform bytea fields (hex strings)
    if (typeof value === 'string' && value.startsWith('\\x')) {
      return toHexString(value);
    }

    // Transform bigint to string
    if (typeof value === 'bigint') {
      return bigIntToString(value);
    }

    // Keep Date objects as-is (will be serialized to ISO string by JSON.stringify)
    if (value instanceof Date) {
      return value;
    }

    // Transform nested objects/arrays
    if (typeof value === 'object') {
      return this.transformData(value);
    }

    return value;
  }
}
