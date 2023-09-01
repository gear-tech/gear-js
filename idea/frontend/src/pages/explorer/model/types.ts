import { HexString } from '@gear-js/api';

type FilterValues = { [filter: string]: boolean };

type FormattedUserMessageSentData = {
  message: {
    payload: HexString | string;
  };
  expiration: string | null;
};

export type { FilterValues, FormattedUserMessageSentData };
