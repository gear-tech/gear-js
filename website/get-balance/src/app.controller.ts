import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { DbService } from './db/db.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly dbService: DbService,
  ) {}

  @Post()
  async getTestBalance(@Body() body: { address: string }) {
    if (await this.dbService.possibleToTransfer(body.address)) {
      return await this.appService.transferBalance(body.address);
    }
    return { error: 'Limit to transfer balance is reached for today' };
  }
}
