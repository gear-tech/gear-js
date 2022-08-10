const ADDRESS = {
  NODE: process.env.REACT_APP_NODE_ADDRESS as string,
};

const LOCAL_STORAGE = {
  ACCOUNT: 'account',
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

const ROLES = [
  { name: USER.PRODUCER, isActive: false },
  { name: USER.DISTRIBUTOR, isActive: false },
  { name: USER.RETAILER, isActive: false },
  { name: USER.CONSUMER, isActive: false },
];

const ACTIONS = {
  [USER.PRODUCER]: [
    { name: 'Produce an item', isActive: false },
    { name: 'Put up an item for a sale', isActive: false },
    { name: 'Approve a purchase', isActive: false },
    { name: 'Ship an item', isActive: false },
    { name: 'Get item info', isActive: false },
  ],
  [USER.DISTRIBUTOR]: [
    { name: 'Purchase an item', isActive: false },
    { name: 'Receive an item', isActive: false },
    { name: 'Process an item', isActive: false },
    { name: 'Package an item', isActive: false },
    { name: 'Put up an item for a sale', isActive: false },
    { name: 'Approve a purchase', isActive: false },
    { name: 'Ship an item', isActive: false },
    { name: 'Get item info', isActive: false },
  ],
  [USER.RETAILER]: [
    { name: 'Purchase an item', isActive: false },
    { name: 'Receive an item', isActive: false },
    { name: 'Put up an item for a sale', isActive: false },
    { name: 'Get item info', isActive: false },
  ],
  [USER.CONSUMER]: [
    { name: 'Purchase an item', isActive: false },
    { name: 'Get item info', isActive: false },
  ],
};

export { ADDRESS, LOCAL_STORAGE, FORM, USER, ROLES, ACTIONS };
