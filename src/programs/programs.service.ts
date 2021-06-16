import { Injectable } from '@nestjs/common';
import { GearNodeService } from 'src/gear-node/gear-node.service';

@Injectable()
export class ProgramsService {
  constructor(private readonly gearNodeService: GearNodeService) {}

  private parseWASM(file) {
    const code = new Uint8Array(file.buffer);
    return code;
  }

  async uploadProgram(client, file) {
    const parsedFile = this.parseWASM(file);
    const bob = this.gearNodeService.getKeyring('//Bob', 'Bob default');

    await this.gearNodeService.submitProgram(
      client,
      bob,
      parsedFile,
      '0x323232',
      '0x424242',
      2,
      2,
    );
  }

  async testFunc() {
    const api = await this.gearNodeService.getApiPromise();
    const alice = this.gearNodeService.getKeyring('//Alice', 'Alice default');
    const bob = this.gearNodeService.getKeyring('//Bob', 'Bob default');

    const transfer = api.tx.gear.sendMessage(
      '0x3242456362772634532632527365463626364545362737464536273746453465',
      '0x4636',
      0,
      0,
    );
    await transfer.signAndSend(alice, ({ events = [], status }) => {
      console.log(status);
      console.log('-----------------------------------------');
      console.log(events);
    });
    return {
      gear: 'b',
    };
  }
}
