import { RESULT } from '../consts';

import { FieldProps } from './field-props';
import { ISailsFuncArg } from './sails';

type HexString = `0x${string}`;

type Result = (typeof RESULT)[keyof typeof RESULT];
type PayloadValue = string | boolean | null | Array<PayloadValue> | { [key: string]: PayloadValue };
type FormattedPayloadValue = { encoded: HexString; decoded: Record<string, unknown> };

export type { HexString, FieldProps, ISailsFuncArg, Result, PayloadValue, FormattedPayloadValue };
