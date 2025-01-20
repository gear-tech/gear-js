const METHOD = {
  GET_EVENT: 'event.data',
  GET_EVENTS: 'event.all',
} as const;

const errorMessage = {
  sailsIdlNotFound: 'SailsIdlNotFound',
};

export { METHOD, errorMessage };
