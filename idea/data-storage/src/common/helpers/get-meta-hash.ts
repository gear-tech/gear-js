import { HexString } from '@polkadot/util/types';
import { GearProgram } from '@gear-js/api';
import { GearCode } from '@gear-js/api/Code';

export async function getMetaHash<T extends GearProgram | GearCode>(tx: T, hex: HexString): Promise<null | HexString> {
  try {
    const metaHash = await tx.metaHash(hex);
    if(metaHash) return metaHash;
  } catch (error) {
    console.log(`${new Date}, getMetaHash: ${error}`);
    return null;
  }
}
