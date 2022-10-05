import { Command, Update } from "nestjs-telegraf";
import { Markup } from "telegraf";

import { Context } from "./types";
import { TgbotService } from "./tgbot.service";

@Update()
export class TgbotController {
  constructor(private tgbotService: TgbotService) {}

    @Command("addAccessUser")
  public async addAccessUser(ctx: Context): Promise<void> {
    // @ts-ignore
    const res = await this.tgbotService.addAccessUser(ctx.message.text, ctx.from.id);

    ctx.reply(res);
  }

    @Command("start")
    public async start(ctx: Context): Promise<void> {
      ctx.reply("hello there! Welcome to 📢😎 Gear upload dapp telegram bot.");
      ctx.reply("commands", Markup
        .keyboard([
          ["/commands", "😎 Popular"],
        ])
        .oneTime()
        .resize());
    }

    @Command("commands")
    public async commands(ctx: Context): Promise<void> {
      const res = await this.tgbotService.commands(ctx.from.id);

      ctx.reply(res);
    }

    @Command("uploadDapps")
    public async uploadDapps(ctx: Context): Promise<void> {
      const res = await this.tgbotService.uploadDapps(ctx.from.id);

      if (Array.isArray(res)) {
        for (const uploadDapp of res) {
          ctx.reply(JSON.stringify(uploadDapp));
        }
        return;
      }

      ctx.reply(res);
    }

  @Command("uploadDapp")
    public async uploadDapp(ctx: Context): Promise<void> {
    // @ts-ignore
      const res = await this.tgbotService.uploadDapp(ctx.from.id, ctx.message.text);

      if (Array.isArray(res)) {
        for (const uploadDapp of res) {
          ctx.reply(JSON.stringify(uploadDapp));
        }
        return;
      }

      ctx.reply(res);
    }

  @Command("uploadCode")
  public async uploadCode(ctx: Context): Promise<void> {
    // @ts-ignore
    const res = await this.tgbotService.uploadCode(ctx.from.id, ctx.message.text);

    if (Array.isArray(res)) {
      for (const uploadDapp of res) {
        ctx.reply(JSON.stringify(uploadDapp));
      }
      return;
    }

    ctx.reply(res);
  }

    @Command("getUserId")
  public async getUserId(ctx: Context): Promise<void> {
    const tgUserData = { username: ctx.from.username, id: ctx.from.id.toString() };
    ctx.reply(JSON.stringify(tgUserData));
  }
}
