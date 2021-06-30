import { Update, Ctx, Start, Help, On, Hears, Command } from 'nestjs-telegraf';
import { TelegramService } from './telegram.service';

@Update()
export class TelegramUpdate {
  private users: Map<number, any>;

  constructor(private readonly tgService: TelegramService) {
    this.users = new Map();
  }

  @Start()
  async start(@Ctx() ctx) {
    ctx.reply('Send the file .wasm for uploading the program to Gear node');
  }

  @Help()
  async help(@Ctx() ctx) {
    await ctx.reply('help');
  }

  @On('text')
  async text(@Ctx() ctx) {
    if (this.users.has(ctx.update.message.from.id)) {
      const cb = (error, result) => {
        if (error) {
          const msg = 'Program upload failed.\n' + error.error;
          this.users;
          ctx.reply(msg);
        } else {
          const msg = `Transaction is ${result.status}`;
          ctx.reply(msg);
        }
      };

      const user = await this.tgService.getUser(ctx.update.message.from, cb);

      let status = this.users.get(ctx.update.message.from.id);
      switch (status) {
        case 'gas':
          this.tgService.setGas(user, +ctx.update.message.text);
          this.users.set(ctx.update.message.from.id, 'value');
          ctx.reply('Enter init value');
          return null;
        case 'value':
          this.tgService.setValue(user, +ctx.update.message.text);
          this.users.set(ctx.update.message.from.id, 'payload');
          ctx.reply('Enter init payload');
          return null;
        case 'payload':
          this.tgService.setPayload(user, ctx.update.message.text);
          this.tgService.uploadProgram(user, cb);
          this.users.delete(ctx.update.message.from.id);
          ctx.reply('Uploading...');
          return null;
      }
    } else {
      ctx.reply('Send the file .wasm for uploading the program to Gear node');
    }
  }

  @On('document')
  async document(@Ctx() ctx) {
    this.users.set(ctx.update.message.from.id, 'file');
    const cb = (error, result) => {
      if (error) {
        const msg = 'Program upload failed.\n' + error.error;
        this.users.delete(ctx.update.message.from.id);
        ctx.reply(msg);
      } else {
        this.users.set(ctx.update.message.from.id, 'gas');
        console.log(this.users);
        ctx.reply('Enter Gas Limit');
      }
    };

    const user = await this.tgService.getUser(ctx.update.message.from, cb);
    if (!user) {
      return null;
    }

    await this.tgService.setFile(user, ctx.update.message.document, cb);
  }

  @Command('balanceUp')
  async balanceUp(@Ctx() ctx) {
    const cb = (error, result) => {
      if (error) {
        const msg = 'Top up balance failed.\n' + error.error;
        ctx.reply(msg);
      } else {
        const msg = result.message;
        ctx.reply(msg);
      }
    };
    const user = await this.tgService.getUser(ctx.update.message.from, cb);
    if (!user) {
      return null;
    }
    await this.tgService.balanceUp(user, cb);
  }

  @Command('getBalance')
  async getBalance(@Ctx() ctx) {
    const cb = (error, result) => {
      if (error) {
      } else {
        const msg = result.message;
        ctx.reply(msg);
      }
    };
    const user = await this.tgService.getUser(ctx.update.message.from, cb);
    if (!user) {
      return null;
    }
    await this.tgService.getBalance(user, cb);
  }
}
