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

export enum MetadataVersion {
  V1Rust = 1,
  V2Rust = 2,
}

enum MetadataTypeName {
  V1Rust = 'ProgramMetadataReprRustV1',
  V2Rust = 'ProgramMetadataReprRustV2',
}

function getMetadataTypeName(version: number): string {
  switch (version) {
    case MetadataVersion.V1Rust:
      return MetadataTypeName.V1Rust;
    case MetadataVersion.V2Rust:
      return MetadataTypeName.V2Rust;
    default:
      throw new Error('Metadata: Invalid metadata version');
  }
}

export class ProgramMetadata extends GearMetadata {
  public types: Omit<HumanProgramMetadataReprRustV1, 'reg'> | Omit<HumanProgramMetadataReprRustV2, 'reg'>;
  public lang: Lang;
  public version: MetadataVersion;

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
      version === MetadataVersion.V1Rust
        ? (metaRepr.toJSON() as HumanProgramMetadataReprRustV1)
        : (metaRepr.toJSON() as HumanProgramMetadataReprRustV2);

    super(reg);

    this.version = version;
    this.lang = lang;
    this.types = types;
  }

  /**
   * ### Get `ProgramMetadata` instance from metadata in hex format
   * Since we've started to support different versions of metadata generated when compilng a program written in Rust
   * it may be necessary to check what the version is. This can be obtained from the `metadata.version` field of `ProgramMetadata` class.
   *
   *
   * This will help to understand what types the metadata contains. For instance, metadata V1 has a `state` field
   * thath describes the type of the output of the `state` function. However, in metadata V2, the `state` field includes 2 types: `input` and `output`.
   * This change was made because starting from this version, the program expects input for the state function.
   * @param hexMetadata metadata generated during program compilation
   *
   * @example
   * import { ProgramMetada, MetadataVersion } from '@gear-js/api';
   *
   * const metaHex = '0x...';
   * const meta = ProgramMetadata.from(metaHex);
   *
   * // State decoding
   * const someBytes = '0x...';
   *
   * if (meta.version === MetadataVersion.V1Rust) {
   *   const result = CreateType.create(meta.types.state, somBytes).toJSON();
   * } else {
   *   const result = CreateType.create(meta.types.state.output, someBytes).toJSON();
   * }
   *
   */
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
