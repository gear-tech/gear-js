import {
  HexString,
  IProgramCreateResult,
  IProgramUploadResult,
  V1000ProgramCreateOptions,
  V1000ProgramUploadOptions,
} from '../../types';
import { GearProgram } from '../../Program';
import { ProgramMetadata } from '../../metadata';

export declare class V1000Program extends GearProgram {
  upload(args: V1000ProgramUploadOptions, meta?: ProgramMetadata, typeIndex?: number): IProgramUploadResult;

  upload(args: V1000ProgramUploadOptions, hexRegistry: HexString, typeIndex: number): IProgramUploadResult;

  upload(
    args: V1000ProgramUploadOptions,
    metaOrHexRegistry?: ProgramMetadata | HexString,
    typeName?: string,
  ): IProgramUploadResult;

  create(args: V1000ProgramCreateOptions, meta?: ProgramMetadata, typeIndex?: number): IProgramCreateResult;
  create(args: V1000ProgramCreateOptions, hexRegistry: `0x${string}`, typeIndex: number): IProgramCreateResult;
  create(
    args: V1000ProgramCreateOptions,
    metaOrHexRegistry?: ProgramMetadata | `0x${string}`,
    typeName?: string | number,
  ): IProgramCreateResult;
}
