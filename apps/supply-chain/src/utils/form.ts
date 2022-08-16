import { isHex } from '@polkadot/util';
import { ProduceForm, ItemInputForm, ItemSwitchForm, ItemForm } from 'components';
import { ACTION } from 'consts';

const isValidHex = (value: string) => (!isHex(value) ? 'Address should be hex' : null);
const isExists = (value: string) => (!value ? 'Field is required' : null);

const getForm = (action: string) => {
  switch (action) {
    case ACTION.PRODUCE:
      return ProduceForm;
    case ACTION.SALE:
      return ItemInputForm;
    case ACTION.APPROVE:
      return ItemSwitchForm;
    case ACTION.PURCHASE:
      return ItemInputForm;
    default:
      return ItemForm;
  }
};

const getLabel = (action: string) => {
  switch (action) {
    case ACTION.SALE:
      return 'Price';
    case ACTION.PURCHASE:
      return 'Delivery Time';
    default:
      return '';
  }
};

const getName = (action: string) => {
  switch (action) {
    case ACTION.SALE:
      return 'price';
    case ACTION.PURCHASE:
      return 'deliveryTime';
    default:
      return '';
  }
};

const getAction = (action: string) => {
  switch (action) {
    case ACTION.SALE:
      return 'sell';
    case ACTION.APPROVE:
      return 'approve';
    case ACTION.SHIP:
      return 'ship';
    case ACTION.PURCHASE:
      return 'purchase';
    case ACTION.RECEIVE:
      return 'recieve';
    case ACTION.PROCESS:
      return 'process';
    case ACTION.PACKAGE:
      return 'pack';
    case ACTION.INFO:
      return 'get info';
    default:
      return '';
  }
};

export { isValidHex, isExists, getForm, getLabel, getName, getAction };
