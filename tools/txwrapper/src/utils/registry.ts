import { ChainProperties, TypeRegistry, getRegistryBase, getSpecTypes } from '@substrate/txwrapper-core';

interface GetRegistryArgs {
  chainProperties: ChainProperties;
  chainName: string;
  specName: string;
  specVersion: number | bigint;
  metadataRpc: `0x${string}`;
  signedExtensions?: string[];
  userExtensions?: Record<
    string,
    {
      extrinsic: Record<string, string>;
      payload: Record<string, string>;
    }
  >;
}

export function getRegistry({
  specName,
  specVersion,
  chainName,
  metadataRpc,
  chainProperties,
  signedExtensions,
  userExtensions,
}: GetRegistryArgs): TypeRegistry {
  const registry = new TypeRegistry();

  return getRegistryBase({
    chainProperties,
    specTypes: getSpecTypes(registry, chainName, specName, specVersion),
    userExtensions,
    signedExtensions,
    metadataRpc,
  });
}
