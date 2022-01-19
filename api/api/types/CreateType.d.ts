import { GearApi } from '.';
import { Metadata } from './interfaces';
import { Registry, Codec } from '@polkadot/types/types';
export declare class CreateType {
  registry: Registry;
  namespaces: Map<string, string>;
  constructor(gearApi?: GearApi);
  private createRegistry;
  static getTypesFromTypeDef(
    types: Uint8Array,
    registry?: Registry,
  ): {
    typesFromTypeDef: any;
    namespaces: Map<string, string>;
  };
  private registerTypes;
  private checkTypePayload;
  create(type: any, payload: any, meta?: Metadata): Codec;
  static encode(type: any, payload: any, meta?: Metadata): Codec;
  static decode(type: string, payload: any, meta?: Metadata): Codec;
  private createType;
}
export declare function parseHexTypes(hexTypes: string): {};
export declare function getTypeStructure(typeName: string, types: any): any;
