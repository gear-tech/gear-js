import type { RESULT } from '../consts';

import type { FieldProps } from './field-props';
import type { ISailsFuncArg } from './sails';

type HexString = `0x${string}`;

type Result = (typeof RESULT)[keyof typeof RESULT];
type PayloadValue = string | boolean | null | Array<PayloadValue> | { [key: string]: PayloadValue };
type FormattedPayloadValue = { encoded: HexString; decoded: Record<string, unknown> };

export type { FieldProps, FormattedPayloadValue, HexString, ISailsFuncArg, PayloadValue, Result };
