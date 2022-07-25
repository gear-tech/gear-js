import { HeaderCol } from 'components/common/Table';
import codeSVG from 'assets/images/code_icon.svg';
import messageIdSVG from 'assets/images/id_icon.svg';
import timestampSVG from 'assets/images/timestamp_icon.svg';

export const TABLE_COLS = [2, 4, 1];

export const TABLE_HEADER: HeaderCol[] = [
  {
    icon: codeSVG,
    text: 'Program name',
  },
  {
    icon: messageIdSVG,
    text: 'Message Id',
  },
  {
    icon: timestampSVG,
    text: 'Timestamp',
  },
];
