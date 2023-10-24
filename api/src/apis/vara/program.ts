import {
  HexString,
  IProgramCreateResult,
  IProgramUploadResult,
  VaraProgramCreateOptions,
  VaraProgramUploadOptions,
} from '../../types';
import { GearProgram } from '../../Program';
import { ProgramMetadata } from '../../metadata';

export declare class VaraProgram extends GearProgram {
  upload(args: VaraProgramUploadOptions, meta?: ProgramMetadata, typeIndex?: number): IProgramUploadResult;

  upload(args: VaraProgramUploadOptions, hexRegistry: HexString, typeIndex: number): IProgramUploadResult;

  upload(
    args: VaraProgramUploadOptions,
    metaOrHexRegistry?: ProgramMetadata | HexString,
    typeName?: string,
  ): IProgramUploadResult;

  create(args: VaraProgramCreateOptions, meta?: ProgramMetadata, typeIndex?: number): IProgramCreateResult;
  create(args: VaraProgramCreateOptions, hexRegistry: `0x${string}`, typeIndex: number): IProgramCreateResult;
  create(
    args: VaraProgramCreateOptions,
    metaOrHexRegistry?: ProgramMetadata | `0x${string}`,
    typeName?: string | number,
  ): IProgramCreateResult;
}
