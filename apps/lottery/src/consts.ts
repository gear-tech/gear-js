import { Hex } from '@gear-js/api';

const ADDRESS = {
  NODE: process.env.REACT_APP_NODE_ADDRESS as string,
  LOTTERY_CONTRACT: process.env.REACT_APP_LOTTERY_CONTRACT_ADDRESS as Hex,
};

const LOCAL_STORAGE = {
  ACCOUNT: 'account',
};

const SUBHEADING = {
  START: "Press 'Start' to set the lottery options.",
  FORM: "Specify lottery duration and, if necessary, the address of the token contract and click the 'Submit and start' button to launch the lottery.",
  PENDING:
    "You can see here the lottery status. Click the 'Pick random winner' button to start the winner selection process.",
};

const STATUS = {
  PENDING: 'In progress',
  FINISHED: 'Finished',
};

export { ADDRESS, LOCAL_STORAGE, SUBHEADING, STATUS };
