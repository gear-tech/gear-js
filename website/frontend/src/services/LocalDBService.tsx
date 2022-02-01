import localForage from 'localforage';

export const localPrograms = localForage.createInstance({
  name: 'programs',
});
