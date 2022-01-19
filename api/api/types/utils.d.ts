import { Text } from '@polkadot/types';
import { Metadata } from './interfaces';
import { CreateType } from '.';
export declare function transformTypes(types: object): any;
export declare function toCamelCase(array: string[] | Text[]): string;
export declare function isJSON(data: any): boolean;
export declare function toJSON(data: any): any;
export declare function splitByCommas(str: string): any[];
export declare function createPayload(createType: CreateType, type: any, data: any, meta?: Metadata): string;
