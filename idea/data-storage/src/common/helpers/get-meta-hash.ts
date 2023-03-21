import { GearProgram } from '@gear-js/api';
import { GearCode } from '@gear-js/api/Code';
import { HexString } from '@polkadot/util/types';

export async function getMetahash(tx: GearProgram | GearCode, id: HexString): Promise<null | HexString> {
  try {
    return await tx.metaHash(id);
  } catch (error) {
    return null;
  }
}
