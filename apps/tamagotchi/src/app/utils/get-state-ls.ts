import { TmgState } from 'app/types/tamagotchi-state';

export const getStateLS = () => {
  return JSON.parse(localStorage.getItem('tmgState') ?? '') as TmgState;
};
