export const genesisHashesCollection = new Set<string>();

export function isTestBalanceAvailable(genesis: string): boolean {
  return genesisHashesCollection.has(genesis);
}
