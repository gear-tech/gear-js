import { Command, Update } from "nestjs-telegraf";
import { UseGuards } from "@nestjs/common";

import { Markup } from "telegraf";
import { DappDataService } from "../dapp-data/dapp-data.service";
import { Context } from "./types";
import { TgAccessAccountsGuard } from "../common/guards/tg-access-accounts.guard";
import { DAPP, REPO } from "../common/enums";
import { TgbotUserRepo } from "./tgbot.repo";

@Update()
export class TgbotService {
  constructor(
    private dappDataService: DappDataService,
    private tgbotUserRepo: TgbotUserRepo,
  ) {}

  @UseGuards(TgAccessAccountsGuard)
  @Command("addCommandsAccessUser")
  public async addAccessUser(ctx: Context) {
    let res;
    // @ts-ignore
    const [, id] = ctx.message.text.split(" ");

    if (!id) {
      res = "Invalid command arguments 😡";
    } else {
      const tgUser = await this.tgbotUserRepo.get(id);

      if (tgUser) {
        res = "User already exists";
      } else {
        await this.tgbotUserRepo.save({ id });
        res = "User successfully register";
      }
    }

    ctx.reply(res);
  }

  @Command("start")
  public async start(ctx: Context) {
    await ctx.reply("hello there! Welcome to 📢😎 Gear upload dapp telegram bot.");
    await ctx.reply("commands", Markup
      .keyboard([
        ["/listCommands", "😎 Popular"], // Row1 with 2 buttons
      ])
      .oneTime()
      .resize());
  }

  @Command("listCommands")
  public async listCommands(ctx: Context) {
    if (await this.validateTgUser(String(ctx.from.id))) {
      await ctx.reply(
        "/uploadDappInChain [repository] [dappName]" + "\n"
        + "/uploadDappsInChain",
      );
    } else {
      await ctx.reply("Access denied");
    }
  }

  @Command("uploadDappsInChain")
  public async uploadDappsInChain(ctx: Context) {
    if (await this.validateTgUser(String(ctx.from.id))) {
      try {
        const uploadDapps = await this.dappDataService.uploadDappsInChain();
        if (uploadDapps.length >= 1) {
          for (const uploadDapp of uploadDapps) {
            await ctx.reply(JSON.stringify(uploadDapp));
          }
        }
      } catch (error) {
        ctx.reply(error.message);
      }
    } else {
      await ctx.reply("Access denied");
    }
  }

  @Command("uploadDappInChain")
  public async uploadDappInChain(ctx: Context) {
    if (await this.validateTgUser(String(ctx.from.id))) {
      // @ts-ignore
      const [, repo, dappName] = ctx.message.text.split(" ");
      let res;

      if (repo && dappName) {
        const repos = Object.values(REPO);
        const dapps = Object.values(DAPP);

        if (repos.includes(repo) && dapps.includes(dappName)) {
          try {
            res = await this.dappDataService.uploadDappInChain({
              repo,
              dappName,
            });
          } catch (error) {
            res = error.message;
          }
        } else {
          res = "Please enter valid repo and dapp name 😡";
        }
      } else {
        res = "Invalid command arguments 😡";
      }

      ctx.reply(res);
    } else {
      await ctx.reply("Access denied");
    }
  }

  @Command("getUserId")
  public async getUserId(ctx: Context) {
    return ctx.reply(String(ctx.from.id));
  }

  private async validateTgUser(userId: string): Promise<boolean> {
    const tgUser = await this.tgbotUserRepo.get(userId);

    return !!tgUser;
  }
}
