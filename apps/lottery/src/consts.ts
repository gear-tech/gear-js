import { Hex } from '@gear-js/api';

const ADDRESS = {
  NODE: process.env.REACT_APP_NODE_ADDRESS as string,
  LOTTERY_CONTRACT: process.env.REACT_APP_LOTTERY_CONTRACT_ADDRESS as Hex,
};

const LOCAL_STORAGE = {
  ACCOUNT: 'account',
};

const SUBHEADING = {
  AWAIT: 'Waiting for owner to start the lottery.',
  PENDING: 'You can see the lottery status here.',
  FORM: "Specify lottery duration and, if necessary, the address of the token contract and click the 'Submit and start' button to launch the lottery.",
};

const STATUS = {
  AWAIT: 'Await',
  PENDING: 'In progress',
  FINISHED: 'Finished',
};

const MULTIPLIER = {
  MILLISECONDS: 1000,
  SECONDS: 60,
  MINUTES: 60,
  HOURS: 24,
};

export { ADDRESS, LOCAL_STORAGE, SUBHEADING, STATUS, MULTIPLIER };
