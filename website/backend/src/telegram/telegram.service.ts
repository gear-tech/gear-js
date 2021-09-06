import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { GearNodeService } from 'src/gear-node/gear-node.service';
import { User } from 'src/users/entities/user.entity';
import { SendMessageData, UploadProgramData } from 'src/gear-node/interfaces';
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

  async getUser(userId) {
    const user = await this.userService.findOneTg(userId);
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

  async balanceUp(user: User, cb) {
    this.gearService.balanceTransfer(user.publicKey, 100000000, cb);
  }

  async getBalance(user: User, cb) {
    const curBalance = await this.gearService.getBalance(user.publicKey);
    cb(undefined, {
      message: `Current free balance is ${curBalance.freeBalance}`,
    });
  }

  sendMessage(user, cb) {
    const messageData: SendMessageData = {
      destination: undefined,
      payload: undefined,
      gasLimit: undefined,
      value: undefined,
    };
    return async (action, data?) => {
      if (action === 'destination') {
        messageData['destination'] = data;
      } else if (action === 'payload') {
        messageData['payload'] = data;
      } else if (action === 'gas') {
        messageData['gasLimit'] = data;
      } else if (action === 'value') {
        messageData['value'] = data;
      } else if (action === 'send') {
        try {
          await this.gearService.sendMessage(
            user,
            messageData,
            (error, result) => {
              if (error) {
              } else {
                cb(undefined, { message: `Response: ${result.data}` });
              }
            },
          );
        } catch (error) {
          cb({ error: error.message });
        }
      }
    };
  }

  uploadProgram(user, cb) {
    const programData: UploadProgramData = {
      gasLimit: undefined,
      value: undefined,
      file: undefined,
      filename: undefined,
    };
    return async (action, data?) => {
      if (action === 'file') {
        const fileName = data.file_name;
        if (fileName.split('.').pop() !== 'wasm') {
          cb({ error: 'Incorrect file format' });
          return null;
        }
        const fileId = data.file_id;
        const path = await this.getPath(fileId);
        const file = await this.getFile(path);
        programData['file'] = file;
        programData['filename'] = fileName;
      } else if (action === 'gas') {
        programData['gasLimit'] = data;
      } else if (action === 'payload') {
        programData['initPayload'] = data;
      } else if (action === 'value') {
        programData['value'] = data;
      } else if (action === 'upload') {
        try {
          await this.gearService.uploadProgram(
            user,
            programData,
            (error, result) => {
              if (error) {
              } else if (result.status !== 'Success') {
                let msg = `Program uploading status: *${result.status}*\nProgramHash: ${result.programHash}`;
                cb(undefined, { message: msg });
              }
            },
          );
        } catch (error) {
          cb({ error: error.message });
        }
      }
    };
  }
}
