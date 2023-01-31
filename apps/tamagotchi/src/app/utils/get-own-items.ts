import { StoreItemsNames } from '../types/ft-store';

export const getOwnItems = (a: number[]) => {
  const res: StoreItemsNames[] = [];
  a.includes(1) && res.push('sword');
  a.includes(2) && res.push('hat');
  a.includes(3) && res.push('glasses');
  a.includes(4) && res.push('bag');
  return res;
};
