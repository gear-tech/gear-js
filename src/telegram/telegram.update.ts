import { Subject } from 'rxjs';
import { Update, Ctx, Start, Help, On, Hears } from 'nestjs-telegraf';
import { TelegramService } from './telegram.service';
import { Any } from 'typeorm';

@Update()
export class TelegramUpdate {
  constructor(private readonly tgService: TelegramService) {}

  @Start()
  async start(@Ctx() ctx) {
    await ctx.reply(
      'Send the file .wasm for uploading the program to Gear node',
    );
  }

  @Help()
  async help(@Ctx() ctx) {
    await ctx.reply('help');
  }

  @On('document')
  async document(@Ctx() ctx) {
    const cb = (error, result) => {
      if (error) {
        const msg = 'Program upload failed.\n' + error.error;
        ctx.reply(msg);
      } else {
        const msg = `Transaction ${result.status}`;
        ctx.reply(msg);
      }
    };

    const user = await this.tgService.getUser(ctx.update.message.from, cb);
    if (!user) {
      return null;
    }
    await this.tgService.uploadProgram(user, ctx.update.message.document, cb);
  }

  @Hears('gas')
  async gasLimit(@Ctx() ctx) {
    console.log(ctx.update.message);
  }
}
