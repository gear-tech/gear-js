import { u16, u8 } from '@polkadot/types';
import { HexString } from '@polkadot/util/types';
import { hexToU8a } from '@polkadot/util';

import { HumanProgramMetadataRepr, ProgramMetadataRepr } from '../types';
import { CreateType } from './create-type';
import { GearMetadata } from './metadata';

enum Lang {
  RUST = 0,
  ASSEMBLYSCRIPT,
}

export class ProgramMetadata extends GearMetadata {
  public types: Omit<HumanProgramMetadataRepr, 'reg'>;

  constructor({ reg, ...types }: HumanProgramMetadataRepr) {
    super(reg);
    this.types = types;
  }
}

export function getProgramMetadata(hexMetadata: HexString | string): ProgramMetadata {
  if (!hexMetadata.startsWith('0x')) {
    hexMetadata = '0x' + hexMetadata;
  }

  const u8aMeta = hexToU8a(hexMetadata);

  const lang = CreateType.create<u8>('u8', u8aMeta[0]).toNumber();

  // TODO: support different versions
  // const version = CreateType.create<u16>('u16', u8aMeta.slice(1, 3)).toNumber();

  if (lang === Lang.RUST) {
    try {
      const metaRepr = CreateType.create<ProgramMetadataRepr>('ProgramMetadataRepr', u8aMeta.slice(3)).toJSON();
      return new ProgramMetadata(metaRepr);
    } catch (err) {
      throw new Error('Metadata: Invalid metadata');
    }
  }

  // TODO: support assemblyscript metadata
}
