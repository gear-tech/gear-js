import { UseFilters, UseGuards } from '@nestjs/common';
import {
  Update,
  Ctx,
  Start,
  Help,
  On,
  Command,
  Message,
} from 'nestjs-telegraf';
import { Doc, Text, User } from './decorators';
import { TgExceptionFilter } from './exceptions';
import { TelegramService } from './telegram.service';
import { TgAuthGuard } from './tg-auth.guard';

@UseFilters(TgExceptionFilter)
@UseGuards(TgAuthGuard)
@Update()
export class TelegramUpdate {
  private users: Map<number, any>;

  constructor(private readonly tgService: TelegramService) {
    this.users = new Map();
  }

  setStatus(userId: number, status: string, callback?: Function) {
    if (!this.users.has(userId)) {
      this.users.set(userId, { status, callback });
    } else {
      if (callback) {
        this.users.get(userId).callback = callback;
      }
      this.users.get(userId).status = status;
    }
  }

  cleanStatus(userId: number) {
    this.users.delete(userId);
  }

  @Start()
  async start(@Ctx() ctx) {
    ctx.reply(
      'Welcome to Gear Bot, the easiest way to launch your dreams on Polkadot Network\n' +
        'For deploying your program to Gear Node send the file .wasm\n' +
        'For sending message to uploaded program run /sendMessage\n' +
        'For checking your balance run /getBalance\n' +
        'For adding funds to your wallet run /balanceUp\n',
    );
  }

  @Help()
  async help(@Ctx() ctx) {
    await ctx.reply(
      'For deploying your program to Gear Node send the file .wasm\n' +
        'For sending message to uploaded program run /sendMessage\n' +
        'For checking your balance run /getBalance\n' +
        'For adding funds to your wallet run /balanceUp\n',
    );
  }

  @Command('balanceUp')
  async balanceUp(@Ctx() ctx, @User() user) {
    const cb = (error, result) => {
      if (error) {
        const msg = 'Top up balance failed.\n' + error.error;
        ctx.reply(msg);
      } else {
        const msg = result.message;
        this.tgService.getBalance(user, (error, result) => {
          if (error) {
          } else {
            ctx.reply(result.message);
          }
        });
        ctx.reply(msg);
      }
    };

    await this.tgService.balanceUp(user, cb);
  }

  @Command('getBalance')
  async getBalance(@Ctx() ctx, @User() user) {
    const cb = (error, result) => {
      if (error) {
      } else {
        const msg = result.message;
        ctx.reply(msg);
      }
    };
    await this.tgService.getBalance(user, cb);
  }

  @Command('sendMessage')
  async sendMessage(@Ctx() ctx, @User() user) {
    this.cleanStatus(user.id);
    this.setStatus(
      user.id,
      'messageDest',
      this.tgService.sendMessage(user, (error, result) => {
        if (error) {
        } else {
          const msg = result.message;
          ctx.reply(msg);
        }
      }),
    );
    ctx.reply('Enter the hash of the target program');
  }

  @On('text')
  async text(@Ctx() ctx, @User() user, @Text() text) {
    if (!this.users.has(user.id)) {
      ctx.reply(
        'For deploying your program to Gear Node send the file .wasm\n' +
          'For sending message to uploaded program run /sendMessage\n',
      );
      return null;
    }

    let { status, callback } = this.users.get(user.id);
    switch (status) {
      case 'gas':
        callback('gas', +text);
        this.setStatus(user.id, 'value');
        ctx.reply('Enter init value');
        return null;
      case 'value':
        callback('value', +text);
        this.setStatus(user.id, 'payload');
        ctx.reply('Enter init payload');
        return null;
      case 'payload':
        callback('payload', text);
        callback('upload');
        this.cleanStatus(user.id);
        ctx.reply('Uploading...');
        return null;

      case 'messageDest':
        callback('destination', text);
        this.setStatus(user.id, 'messagePayload');
        ctx.reply('Enter a message');
        return null;
      case 'messagePayload':
        callback('payload', text);
        this.setStatus(user.id, 'messageGas');
        ctx.reply('Enter gas limit');
        return null;
      case 'messageGas':
        callback('gas', +text);
        this.setStatus(user.id, 'messageValue');
        ctx.reply('Enter initial value');
        return null;
      case 'messageValue':
        callback('value', +text);
        callback('send');
        this.cleanStatus(user.id);
        return null;
    }
  }

  @On('document')
  async document(@Ctx() ctx, @User() user, @Doc() file) {
    this.cleanStatus(user.id);
    this.setStatus(
      user.id,
      'program',
      this.tgService.uploadProgram(user, (error, result) => {
        if (error) {
          const msg = 'Program upload failed.\n' + error.error;
          this.cleanStatus(user.id);
          ctx.reply(msg);
        } else {
          ctx.reply(result.message, { parse_mode: 'MarkdownV2' });
        }
      }),
    );

    this.users.get(user.id).callback('file', file);
    this.setStatus(user.id, 'gas');
    ctx.reply('Enter gas limit');
  }
}
