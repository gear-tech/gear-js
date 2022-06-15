import { Hex } from '@gear-js/api';

import { PayloadValue } from 'components/common/Form/FormPayload/types';

export type FormValues = {
  payload: PayloadValue;
};

export type PageParams = {
  programId: Hex;
};
