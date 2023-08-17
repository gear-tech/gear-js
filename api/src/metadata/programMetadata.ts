import { u16, u8 } from '@polkadot/types';
import { hexToU8a } from '@polkadot/util';

import {
  HumanProgramMetadataReprRustV1,
  HumanProgramMetadataReprRustV2,
  ProgramMetadataRepr,
  ProgramMetadataReprRustV1,
  ProgramMetadataReprRustV2,
} from '../types';
import { CreateType } from './create-type';
import { GearMetadata } from './metadata';

export enum Lang {
  RUST = 0,
}

export enum VersionsRust {
  V1 = 1,
  V2 = 2,
}

function getMetadataTypeName(version: number): string {
  switch (version) {
    case VersionsRust.V1:
      return 'ProgramMetadataReprRustV1';
    case VersionsRust.V2:
      return 'ProgramMetadataReprRustV2';
    default:
      throw new Error('Metadata: Invalid metadata version');
  }
}

export class ProgramMetadata extends GearMetadata {
  public types: Omit<HumanProgramMetadataReprRustV1, 'reg'> | Omit<HumanProgramMetadataReprRustV2, 'reg'>;
  public lang: Lang;
  public version: VersionsRust;

  constructor(metadata: Uint8Array, lang: number, version: number) {
    let metaRepr: ProgramMetadataRepr;
    if (lang === Lang.RUST) {
      try {
        metaRepr = CreateType.create<ProgramMetadataReprRustV1 | ProgramMetadataReprRustV2>(
          getMetadataTypeName(version) as string,
          metadata,
        );
      } catch (err) {
        throw new Error('Metadata: Invalid metadata');
      }
    } else {
      throw new Error('Metadata: Unsupported lang');
    }

    const { reg, ...types } =
      version === VersionsRust.V1
        ? (metaRepr.toJSON() as HumanProgramMetadataReprRustV1)
        : (metaRepr.toJSON() as HumanProgramMetadataReprRustV2);

    super(reg);

    this.version = version;
    this.lang = lang;
    this.types = types;
  }

  static from(hexMetadata: string): ProgramMetadata {
    if (!hexMetadata.startsWith('0x')) {
      hexMetadata = '0x' + hexMetadata;
    }
    const u8aMeta = hexToU8a(hexMetadata);

    const lang = CreateType.create<u8>('u8', u8aMeta[0]).toNumber();
    const version = CreateType.create<u16>('u16', u8aMeta.slice(1, 3)).toNumber();

    return new ProgramMetadata(u8aMeta.slice(3), lang, version);
  }
}
