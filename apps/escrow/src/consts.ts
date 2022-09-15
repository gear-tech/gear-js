const ADDRESS = {
  NODE: process.env.REACT_APP_NODE_ADDRESS as string,
  DAPPS_API: process.env.REACT_APP_DAPPS_API_ADDRESS as string,
};

const LOCAL_STORAGE = {
  ACCOUNT: 'account',
  PROGRAM: 'program',
  WALLET: 'wallet',
};

const FORM = {
  INIT: { PROGRAM: 'initProgram', WALLET: 'initWallet' },
  INPUT: { PROGRAM: 'inputProgram', WALLET: 'inputWallet' },
};

const ESCROW = {
  ROLE: {
    BUYER: 'Buyer',
    SELLER: 'Seller',
  },
  STATE: {
    AWAITING_DEPOSIT: 'AwaitingDeposit',
    AWAITING_CONFIRMATION: 'AwaitingConfirmation',
    CLOSED: 'Closed',
  },
};

export { ADDRESS, LOCAL_STORAGE, FORM, ESCROW };
