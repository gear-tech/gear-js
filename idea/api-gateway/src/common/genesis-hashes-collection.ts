export const genesisHashesCollection = new Set<string>();

export function isValidGenesis(genesis: string): boolean {
  return genesisHashesCollection.has(genesis);
}
