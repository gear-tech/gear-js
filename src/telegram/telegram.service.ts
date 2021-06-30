import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { GearNodeService } from 'src/gear-node/gear-node.service';
import { User } from 'src/users/entities/user.entity';
const fetch = require('node-fetch');

@Injectable()
export class TelegramService {
  private programs: Map<number, any>;

  constructor(
    private readonly userService: UsersService,
    private readonly gearService: GearNodeService,
  ) {
    this.programs = new Map();
  }

  async getUser(userData, cb?) {
    const user = await this.userService.findOneTg(userData.id);
    if (!user) {
      cb({
        error:
          'User is not found. Please register on https://idea.gear-tech.io',
      });
      return null;
    }
    return user;
  }

  private async getFile(filePath) {
    const url = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${filePath}`;
    const response = await fetch(url, {
      method: 'GET',
    });
    const buffer = await response.buffer();
    return buffer;
  }

  private async getPath(fileId) {
    const url = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/getFile?file_id=${fileId}`;
    const response = await fetch(url, {
      method: 'GET',
    });
    const json = await response.json();
    return json.result.file_path;
  }

  async uploadProgram(user: User, cb) {
    await this.gearService.uploadProgram(user, this.programs[user.id], cb);
    this.programs.delete(user.id);
  }

  async balanceUp(user: User, cb) {
    this.gearService.balanceTransfer(user.publicKey, 43214321, cb);
  }

  async getBalance(user: User, cb) {
    const curBalance = await this.gearService.getBalance(user.publicKey);
    cb(undefined, { message: `Current free balance is ${curBalance}` });
  }

  async setFile(user, fileData, cb) {
    const fileName = fileData.file_name;
    if (fileName.split('.').pop() !== 'wasm') {
      cb({ error: 'Incorrect file format' });
      return null;
    }
    const fileId = fileData.file_id;
    const path = await this.getPath(fileId);
    const file = this.getFile(path);
    this.programs[user.id] = { file: file, filename: fileName };
    cb(undefined, 'ok');
  }

  setGas(user, gasLimit) {
    this.programs[user.id].gasLimit = gasLimit;
  }

  setValue(user, value) {
    this.programs[user.id].value = value;
  }

  setPayload(user, init_payload) {
    this.programs[user.id].value = init_payload;
  }
}
