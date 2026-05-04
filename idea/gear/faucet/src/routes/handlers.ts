import type { Response } from 'express';
import type { Hex } from 'viem';
import type { Logger } from 'winston';
import { FaucetType } from '../database';
import type { RequestService } from '../services';

export async function handleVaraTestnetRequest(
  address: Hex,
  genesis: Hex,
  requestService: RequestService,
  logger: Logger,
  res: Response,
) {
  if (!address || !genesis) {
    res.status(400).json({ error: 'Address and genesis are required' });
    return;
  }

  try {
    await requestService.newRequest(address, genesis, FaucetType.VaraTestnet);
  } catch (error: any) {
    if (error.code) {
      logger.error(error.message, { address, target: genesis });
      return res.status(error.code).json({ error: error.message });
    }

    logger.error(error.message, { stack: error.stack, address, genesis });
    return res.status(500).json({ error: error.message });
  }
  res.sendStatus(200);
}
