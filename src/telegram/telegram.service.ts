import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { GearNodeService } from 'src/gear-node/gear-node.service';
const fetch = require('node-fetch');

@Injectable()
export class TelegramService {
  constructor(
    private readonly userService: UsersService,
    private readonly gearService: GearNodeService,
  ) {}

  async getUser(userData, cb) {
    const user = await this.userService.findOneTg(userData.id);
    if (!user) {
      cb({ error: 'User is not found. Please register on gear-tech.io' });
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

  async uploadProgram(user, fileData, cb) {
    const fileName = fileData.file_name;
    if (fileName.split('.').pop() !== 'wasm') {
      cb({ error: 'Incorrect file format' });
      return null;
    }
    console.log(fileData);
    const fileId = fileData.file_id;
    const path = await this.getPath(fileId);
    const file = this.getFile(path);
    this.gearService.uploadProgram(
      user,
      {
        file: file,
        filename: fileName,
        gasLimit: 2000,
        value: 2000,
        mnemonic: '',
        init_payload: '',
      },
      cb,
    );
  }
}
