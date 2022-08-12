const ADDRESS = {
  NODE: process.env.REACT_APP_NODE_ADDRESS as string,
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

export { ADDRESS, LOCAL_STORAGE, FORM, USER, ROLES, ACTION, ACTIONS };
