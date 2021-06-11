import { Injectable } from '@nestjs/common';
import { ApiPromise, WsProvider } from '@polkadot/api';

@Injectable()
export class ProgramsService {
  async getApiPromise() {
    const provider = new WsProvider(process.env.WS_PROVIDER);
    return await ApiPromise.create({ provider });
  }

  private parseWASM(file) {
    const filename = file.originalname;
    const unit8Array = new Uint8Array(file.buffer);
    return {
      filename,
      unit8Array,
    };
  }

  async uploadProgram(file, body) {
    const parsedFile = this.parseWASM(file);

    return parsedFile;
  }
}
