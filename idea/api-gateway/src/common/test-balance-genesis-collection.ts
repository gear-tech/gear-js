export const testBalanceGenesisCollection = new Set<string>();

export function isTestBalanceAvailable(genesis: string): boolean {
  return testBalanceGenesisCollection.has(genesis);
}
