export function getProviderAddress(providers: string[] = []): string | null {
  if (providers.length === 0) {
    return null;
  }

  return providers[0];
}
