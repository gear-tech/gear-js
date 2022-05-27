import { Metadata } from '@gear-js/api';

import { ParsedTypeStructure } from 'components/common/FormPayload/types';

export type ProgramValues = {
  value: number;
  payload: ParsedTypeStructure;
  gasLimit: number;
  programName: string;
};

export type FormValues = {
  metaValues: Metadata;
  programValues: ProgramValues;
};
