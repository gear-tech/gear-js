import { Node } from 'entities/node';
import { LocalStorage } from 'shared/config';

const getLocalNodes = (): Node[] => {
  const nodes = localStorage.getItem(LocalStorage.Nodes);

  return nodes ? JSON.parse(nodes) : [];
};

export { getLocalNodes };
