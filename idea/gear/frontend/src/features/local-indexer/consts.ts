import localForage from 'localforage';

const PROGRAMS_LOCAL_FORAGE = localForage.createInstance({ name: 'programs' });
const METADATA_LOCAL_FORAGE = localForage.createInstance({ name: 'metadata' });

export { METADATA_LOCAL_FORAGE, PROGRAMS_LOCAL_FORAGE };
