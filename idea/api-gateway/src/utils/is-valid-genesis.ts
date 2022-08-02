import { genesisHashesCollection } from '../common/genesis-hashes-collection';

function isValidGenesis(genesis: string): boolean {
  return genesisHashesCollection.has(genesis);
}

export { isValidGenesis };

