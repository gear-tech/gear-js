import { Command, Update } from "nestjs-telegraf";
import { UseGuards } from "@nestjs/common";

import { Markup } from "telegraf";
import { DappDataService } from "../dapp-data/dapp-data.service";
import { Context } from "./types";
import { TgAccessAccountsGuard } from "../common/guards/tg-access-accounts.guard";
import { DAPP, REPO } from "../common/enums";

@Update()
export class TgbotService {
  constructor(private dappDataService: DappDataService) {}

  @UseGuards(TgAccessAccountsGuard)
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

  @UseGuards(TgAccessAccountsGuard)
  @Command("listCommands")
  public async listCommands(ctx: Context) {
    await ctx.reply(
      "/uploadDappInChain [repository] [dappName]" + "\n"
      + "/uploadDappsInChain",
    );
  }

  @UseGuards(TgAccessAccountsGuard)
  @Command("uploadDappsInChain")
  public async uploadDappsInChain(ctx: Context) {
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
  }

  @UseGuards(TgAccessAccountsGuard)
  @Command("uploadDappInChain")
  public async uploadDappInChain(ctx: Context) {
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
  }
}
