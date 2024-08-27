import { SIGNLESS_STORAGE_KEY } from './consts';

const getStorage = () => JSON.parse(localStorage[SIGNLESS_STORAGE_KEY] || '{}') as Storage;

export { getStorage };
