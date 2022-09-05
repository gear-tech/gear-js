import { CreateType, getWasmMetadata, Metadata } from '@gear-js/api';
import { assertNotNull } from '@subsquid/substrate-processor';
import { readFileSync } from 'fs';

export class Meta {
  metaWasm: Buffer;
  metadata: Metadata;
  createType: CreateType;
  typeIn: string;
  typeOut: string;

  constructor(pathToMeta: string) {
    this.metaWasm = readFileSync(pathToMeta);
    this.createType = new CreateType();
  }

  async init() {
    this.metadata = await getWasmMetadata(this.metaWasm);
    this.typeIn = assertNotNull(this.metadata.handle_input, 'Handle input type not found');
    this.typeOut = assertNotNull(this.metadata.handle_output, 'Handle output type not found');
    this.createType = new CreateType();
  }

  decodeIn(payload: string) {
    return this.createType.create(this.typeIn, payload, this.metadata).toJSON();
  }

  decodeOut(payload: string): Record<string, any> {
    try {
      return this.createType.create(this.typeOut, payload, this.metadata).toJSON() as Record<string, any>;
    } catch (error) {
      console.log(payload);
      throw error;
    }
  }
}
