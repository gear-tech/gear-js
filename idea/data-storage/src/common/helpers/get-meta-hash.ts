import { HexString } from '@polkadot/util/types';

import { GearApiModule } from '../types';

export async function getMetaHash(tx: GearApiModule, hex: HexString): Promise<null | HexString> {
  try {
    const metaHash = await tx.metaHash(hex);
    if(metaHash) return metaHash;
  } catch (error) {
    console.log(`${new Date}, getMetaHash: ${error}`);
    return null;
  }
}
