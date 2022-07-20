import { HeaderCol } from 'components/common/Table';
import codeSVG from 'assets/images/code_icon.svg';
import messageIdSVG from 'assets/images/id_icon.svg';
import shoppingBagSVG from 'assets/images/shoppingBag.svg';

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
    icon: shoppingBagSVG,
    text: 'Block left',
  },
];
