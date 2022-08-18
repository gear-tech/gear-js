import { isHex } from '@polkadot/util';
import { ProduceForm, ItemInputForm, ItemSwitchForm, ItemForm } from 'components';
import { ACTION, USER } from 'consts';
import { Items } from 'types';

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
      return 'receive';
    case ACTION.PROCESS:
      return 'process';
    case ACTION.PACKAGE:
      return 'pack';
    default:
      return 'get info';
  }
};

const getItems = (items: Items) => Object.keys(items).map((id) => ({ id, state: items[id].state }));

const getFilteredItems = (items: Items, role: string, action: string) =>
  getItems(items)
    .filter(({ state }) => {
      switch (role) {
        case USER.PRODUCER: {
          switch (action) {
            case ACTION.SALE:
              return state === 'Produced';

            case ACTION.APPROVE:
              return state === 'PurchasedByDistributor';

            case ACTION.SHIP:
              return state === 'ApprovedByProducer';

            default:
              return true;
          }
        }

        case USER.DISTRIBUTOR: {
          switch (action) {
            case ACTION.PURCHASE:
              return state === 'ForSaleByProducer';

            case ACTION.RECEIVE:
              return state === 'ShippedByProducer';

            case ACTION.PROCESS:
              return state === 'ReceivedByDistributor';

            case ACTION.PACKAGE:
              return state === 'ProcessedByDistributor';

            case ACTION.SALE:
              return state === 'PackagedByDistributor';

            case ACTION.APPROVE:
              return state === 'PurchasedByRetailer';

            case ACTION.SHIP:
              return state === 'ApprovedByDistributor';

            default:
              return true;
          }
        }

        case USER.RETAILER: {
          switch (action) {
            case ACTION.PURCHASE:
              return state === 'ForSaleByDistributor';

            case ACTION.RECEIVE:
              return state === 'ShippedByDistributor';

            case ACTION.SALE:
              return state === 'ReceivedByRetailer';

            default:
              return true;
          }
        }

        default: {
          switch (action) {
            case ACTION.PURCHASE:
              return state === 'ForSaleByRetailer';

            default:
              return true;
          }
        }
      }
    })
    .map(({ id }) => id);

export { isValidHex, isExists, getForm, getLabel, getName, getAction, getFilteredItems };
