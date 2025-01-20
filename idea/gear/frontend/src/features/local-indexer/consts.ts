import localForage from 'localforage';

const PROGRAMS_LOCAL_FORAGE = localForage.createInstance({ name: 'programs' });
const METADATA_LOCAL_FORAGE = localForage.createInstance({ name: 'metadata' });

export { PROGRAMS_LOCAL_FORAGE, METADATA_LOCAL_FORAGE };
