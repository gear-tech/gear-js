import { HeaderCol } from 'components/common/Table';

import hashSVG from 'assets/images/table/hash.svg';
import codeSVG from 'assets/images/table/code_icon.svg';
import timestampSVG from 'assets/images/table/timestamp_icon.svg';

export const TABLE_COLS = [2, 4, 1];

export const TABLE_HEADER: HeaderCol[] = [
  {
    icon: codeSVG,
    text: 'Code name',
  },
  {
    icon: hashSVG,
    text: 'Code hash',
  },
  {
    icon: timestampSVG,
    text: 'Timestamp',
  },
];
