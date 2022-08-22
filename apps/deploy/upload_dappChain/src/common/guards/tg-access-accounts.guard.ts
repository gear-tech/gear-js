import { Context } from "telegraf";
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { TelegrafExecutionContext, TelegrafException } from "nestjs-telegraf";

import "dotenv/config";

@Injectable()
export class TgAccessAccountsGuard implements CanActivate {
  constructor() {}

  canActivate(context: ExecutionContext): boolean {
    const ctx = TelegrafExecutionContext.create(context);
    const { from } = ctx.getContext<Context>();

    const accounts = process.env.TELEGRAM_ACCESS_ACCOUNTS.split(",");
    const isAccessAccount = accounts.includes(from.username);
    if (!isAccessAccount) {
      throw new TelegrafException("You are not include access accounts 😡");
    }

    return true;
  }
}
