import { GearProgram } from '@gear-js/api';
import { GearCode } from '@gear-js/api/Code';
import { HexString } from '@polkadot/util/types';
import { generateCodeHash } from '@gear-js/api';

export async function getMetahash(entity: GearProgram | GearCode, id: HexString): Promise<HexString | null> {
  try {
    return await entity.metaHash(id);
  } catch (error) {
    return null;
  }
}

export function generateMetahash(hex: HexString): HexString {
  return generateCodeHash(hex);
}
