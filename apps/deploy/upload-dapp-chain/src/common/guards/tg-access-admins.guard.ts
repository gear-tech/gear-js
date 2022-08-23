import { Context } from "telegraf";
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { TelegrafExecutionContext, TelegrafException } from "nestjs-telegraf";

import "dotenv/config";

@Injectable()
export class TgAccessAdminsGuard implements CanActivate {
  constructor() {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = TelegrafExecutionContext.create(context);
    const { from } = ctx.getContext<Context>();

    const admins = process.env.TELEGRAM_ACCESS_ACCOUNTS.split(",");

    const isAdminAccount = admins.includes(from.username);
    if (!isAdminAccount) {
      throw new TelegrafException("You are not include admin accounts 😡");
    }

    return true;
  }
}
