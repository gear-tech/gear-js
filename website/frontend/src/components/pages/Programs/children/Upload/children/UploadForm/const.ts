import { FormValues } from './types';

import { MIN_GAS_LIMIT } from 'consts';
import { INITIAL_VALUES as META_INITIAL_VALUES } from 'components/blocks/UploadMetaForm/model/const';

export const INITIAL_VALUES: FormValues = {
  metaValues: META_INITIAL_VALUES,
  programValues: {
    value: 0,
    payload: '0x00',
    gasLimit: MIN_GAS_LIMIT,
    programName: '',
  },
};
