import { ReactComponent as produceSVG } from 'assets/images/actions/produce.svg';
import { ReactComponent as saleSVG } from 'assets/images/actions/sale.svg';
import { ReactComponent as approveSVG } from 'assets/images/actions/approve.svg';
import { ReactComponent as shipSVG } from 'assets/images/actions/ship.svg';
import { ReactComponent as purchaseSVG } from 'assets/images/actions/purchase.svg';
import { ReactComponent as receiveSVG } from 'assets/images/actions/receive.svg';
import { ReactComponent as processSVG } from 'assets/images/actions/process.svg';
import { ReactComponent as packSVG } from 'assets/images/actions/pack.svg';
import { ReactComponent as infoSVG } from 'assets/images/actions/info.svg';

const ADDRESS = {
  NODE: process.env.REACT_APP_NODE_ADDRESS as string,
  DAPPS_API: process.env.REACT_APP_DAPPS_API_ADDRESS as string,
};

const LOCAL_STORAGE = {
  ACCOUNT: 'account',
  PROGRAM: 'program',
};

const FORM = {
  CREATE: 'create',
  USE: 'use',
};

const USER = {
  PRODUCER: 'Producer',
  DISTRIBUTOR: 'Distributor',
  RETAILER: 'Retailer',
  CONSUMER: 'Consumer',
};

const ROLES = Object.values(USER);

const ACTION = {
  PRODUCE: 'Produce an item',
  SALE: 'Put up an item for a sale',
  APPROVE: 'Approve a purchase',
  SHIP: 'Ship an item',
  PURCHASE: 'Purchase an item',
  RECEIVE: 'Receive an item',
  PROCESS: 'Process an item',
  PACKAGE: 'Package an item',
  INFO: 'Get item info',
};

const ACTIONS = {
  [USER.PRODUCER]: [ACTION.PRODUCE, ACTION.SALE, ACTION.APPROVE, ACTION.SHIP, ACTION.INFO],
  [USER.DISTRIBUTOR]: [
    ACTION.PURCHASE,
    ACTION.RECEIVE,
    ACTION.PROCESS,
    ACTION.PACKAGE,
    ACTION.SALE,
    ACTION.APPROVE,
    ACTION.SHIP,
    ACTION.INFO,
  ],
  [USER.RETAILER]: [ACTION.PURCHASE, ACTION.RECEIVE, ACTION.SALE, ACTION.INFO],
  [USER.CONSUMER]: [ACTION.PURCHASE, ACTION.INFO],
};

const ACTION_ICONS = {
  [ACTION.PRODUCE]: produceSVG,
  [ACTION.SALE]: saleSVG,
  [ACTION.APPROVE]: approveSVG,
  [ACTION.SHIP]: shipSVG,
  [ACTION.PURCHASE]: purchaseSVG,
  [ACTION.RECEIVE]: receiveSVG,
  [ACTION.PROCESS]: processSVG,
  [ACTION.PACKAGE]: packSVG,
  [ACTION.INFO]: infoSVG,
};

export { ADDRESS, LOCAL_STORAGE, FORM, USER, ROLES, ACTION, ACTIONS, ACTION_ICONS };
