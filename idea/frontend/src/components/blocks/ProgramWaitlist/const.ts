import { HeaderCol } from 'components/common/Table';
import messageIdSVG from 'assets/images/table/id_icon.svg';
import shoppingBagSVG from 'assets/images/table/shoppingBag.svg';
import arrowBackSVG from 'assets/images/arrow_back.svg';

export const TABLE_COLS = [2, 2, 2, 1];

export const TABLE_HEADER: HeaderCol[] = [
  {
    icon: messageIdSVG,
    text: 'Message Id',
  },
  {
    icon: arrowBackSVG,
    text: 'Entry',
  },
  {
    icon: shoppingBagSVG,
    text: 'Start block',
  },
  {
    icon: shoppingBagSVG,
    text: 'Finish block',
  },
];
