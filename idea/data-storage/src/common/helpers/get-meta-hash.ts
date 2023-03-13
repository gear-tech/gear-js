import { GearProgram } from '@gear-js/api';
import { GearCode } from '@gear-js/api/Code';
import { HexString } from '@polkadot/util/types';
import { dataStorageLogger } from '../data-storage.logger';

export async function getMetahash(tx: GearProgram | GearCode, id: HexString): Promise<null | HexString> {
  try {
    return await tx.metaHash(id);
  } catch (error) {
    dataStorageLogger.error(`Unable to get metahash of ${id}. ${error.message}`);
    return null;
  }
}
