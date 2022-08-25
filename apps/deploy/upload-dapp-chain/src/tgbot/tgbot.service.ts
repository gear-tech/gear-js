import { Command, Update } from "nestjs-telegraf";
import { Markup } from "telegraf";

import { DappDataService } from "../dapp-data/dapp-data.service";
import { Context } from "./types";
import { DAPP, REPO, Role, TBErrorMessage } from "../common/enums";
import { getTgCommands } from "../common/hellpers";
import { UserService } from "../user/user.service";
import { UserRepo } from "../user/user.repo";
import { UploadDappInChainTGInput } from "../dapp-data/types";

@Update()
export class TgbotService {
  constructor(
    private dappDataService: DappDataService,
    private userService: UserService,
    private userRepository: UserRepo,
  ) {}

  @Command("addAccessUser")
  public async addAccessUser(ctx: Context): Promise<void> {
    // @ts-ignore
    const [, id] = ctx.message.text.split(" ");

    if (await this.userService.isAdmin(String(ctx.from.id))) {
      if (!id) {
        ctx.reply(TBErrorMessage.COMMAND_ARGUMENTS_REQUIRED);
        return;
      }
      const user = await this.userRepository.get(id);

      if (user) {
        ctx.reply("User already exists");
        return;
      }

      await this.userService.creatUser({ id, role: Role.DEV });
      ctx.reply("User successfully register");
      return;
    }
    ctx.reply(TBErrorMessage.ACCESS_DENIED);
  }

  @Command("start")
  public async start(ctx: Context): Promise<void> {
    ctx.reply("hello there! Welcome to 📢😎 Gear upload dapp telegram bot.");
    ctx.reply("commands", Markup
      .keyboard([
        ["/listCommands", "😎 Popular"],
      ])
      .oneTime()
      .resize());
  }

  @Command("listCommands")
  public async listCommands(ctx: Context): Promise<void> {
    if (await this.userService.validate(String(ctx.from.id))) {
      ctx.reply(getTgCommands());
      return;
    }

    ctx.reply(TBErrorMessage.ACCESS_DENIED);
  }

  @Command("uploadDappsInChain")
  public async uploadDappsInChain(ctx: Context): Promise<void> {
    if (await this.userService.validate(String(ctx.from.id))) {
      try {
        const uploadDapps = await this.dappDataService.uploadDappsInChain();
        if (uploadDapps.length >= 1) {
          for (const uploadDapp of uploadDapps) {
            ctx.reply(JSON.stringify(uploadDapp));
          }
        }
        return;
      } catch (error) {
        ctx.reply(error);
        return;
      }
    }

    ctx.reply(TBErrorMessage.ACCESS_DENIED);
  }

  @Command("uploadDappInChain")
  public async uploadDappInChain(ctx: Context): Promise<void> {
    if (await this.userService.validate(String(ctx.from.id))) {
      // @ts-ignore
      const [, repo, dappName] = ctx.message.text.split(" ");

      if (repo && dappName) {
        const repos = Object.values(REPO);
        const dapps = Object.values(DAPP);

        if (repos.includes(repo) && dapps.includes(dappName)) {
          try {
            let uploadDapp;
            const uploadDappInChainTGInput: UploadDappInChainTGInput = { repo, dappName };
            if (repo === REPO.NON_FUNGIBLE_TOKEN && dappName === DAPP.NFT_MARKETPLACE) {
              uploadDapp = await this.dappDataService.uploadMarketPlaceDapp(uploadDappInChainTGInput);
              ctx.reply(uploadDapp);
              return;
            }

            uploadDapp = await this.dappDataService.uploadDappInChain({
              repo,
              dappName,
            });
            ctx.reply(uploadDapp);
            return;
          } catch (error) {
            ctx.reply(error.message);
            return;
          }
        }
        ctx.reply(TBErrorMessage.INVALID_COMMAND_ARGUMENTS);
        return;
      }

      ctx.reply(TBErrorMessage.COMMAND_ARGUMENTS_REQUIRED);
      return;
    }

    ctx.reply(TBErrorMessage.ACCESS_DENIED);
  }

  @Command("getUserId")
  public async getUserId(ctx: Context): Promise<void> {
    const tgUserData = { username: ctx.from.username, id: ctx.from.id.toString() };
    ctx.reply(JSON.stringify(tgUserData));
  }
}
