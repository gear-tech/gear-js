const ADDRESS = {
  NODE: process.env.REACT_APP_NODE_ADDRESS as string,
  DAPPS_API: process.env.REACT_APP_DAPPS_API_ADDRESS as string,
};

const LOCAL_STORAGE = {
  ACCOUNT: 'account',
};

const SUBHEADING = {
  AWAIT: 'Waiting for owner to start the Game of chance.',
  PENDING: 'You can see the Game of chance status here.',
  FORM: "Specify Game of chance duration and, if necessary, the address of the token contract and click the 'Submit and start' button to launch the Game of chance.",
  LOGIN: 'In order to start, please login.',
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
