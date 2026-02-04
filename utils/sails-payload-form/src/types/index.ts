import { HexString } from '@gear-js/api';

import { RESULT } from '../consts';

import { FieldProps } from './field-props';
import { ISailsFuncArg } from './sails';

type Result = (typeof RESULT)[keyof typeof RESULT];
type PayloadValue = string | boolean | null | Array<PayloadValue> | { [key: string]: PayloadValue };
type FormattedPayloadValue = { encoded: HexString; decoded: Record<string, unknown> };

export type { FieldProps, ISailsFuncArg, Result, PayloadValue, FormattedPayloadValue };
