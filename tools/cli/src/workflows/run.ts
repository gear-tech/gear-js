import fs from 'node:fs';
import { parse } from 'yaml';
import { GearApi } from '@gear-js/api';
import { waitReady } from '@polkadot/wasm-crypto';

import { getCodes, uploadCode, sendMessage, getPrograms, uploadProgram, fundAccounts, getAccounts } from '../gear';
import { validateScheme } from './validate';
import { getPayload } from './payload';
import { CLIArguments, IScheme, WsAddress } from '../types';
import { logger } from '../utils';
import { replaceCliArgs } from './replace';

export async function runWorkflow(pathToScheme: string, cliArguments: CLIArguments, wsAddress?: WsAddress) {
  const schemeFile = fs.readFileSync(pathToScheme, 'utf-8');
  const scheme: IScheme = parse(schemeFile);
  if (wsAddress) {
    scheme.wsAddress = wsAddress;
  }
  replaceCliArgs(scheme, cliArguments);
  const errors = validateScheme(scheme);
  if (errors) {
    logger.error('Scheme validation failed due to the following errors:', { lvl: 0 });
    console.log();
    logger.error(errors.map((e) => JSON.stringify(e, undefined, 2)).join('\n'));
    process.exit(1);
  }

  await waitReady();

  const basePath = pathToScheme.split('/').slice(0, -1).join('/');
  const api = new GearApi({ providerAddress: scheme.wsAddress, noInitWarn: true });
  try {
    await api.isReadyOrError;
  } catch (_) {
    throw new Error(`Unable to connect to ${scheme.wsAddress}`);
  }

  logger.info(`Connected to ${await api.chain()}\n`, { lvl: 0 });

  logger.info('Set accounts', { lvl: 0 });
  const accounts = getAccounts(scheme.accounts);
  const programs = getPrograms(scheme.programs, basePath);
  const codes = getCodes(scheme.codes || []);

  if (scheme.fund_accounts) {
    logger.info(`Fund accounts ${JSON.stringify(scheme.fund_accounts)}\n`, { lvl: 0 });
    await fundAccounts(api, accounts, scheme.prefunded_account, scheme.fund_accounts);
  }

  for (const tx of scheme.transactions) {
    const acc = accounts[tx.account];

    if (tx.type === 'upload_code') {
      const code = codes[tx.code];
      logger.info(`Upload code ${JSON.stringify(code.name)}`, { lvl: 0 });
      const { codeHash } = await uploadCode(api, acc, code.path_to_wasm);
      console.log();
      code.hash = codeHash;
      continue;
    }

    if (tx.type === 'upload_program') {
      const program = programs[tx.program];
      logger.info(`Upload ${program.name}`, { lvl: 0 });
      program.address = await uploadProgram(
        api,
        acc,
        program.wasm,
        program.meta,
        getPayload(accounts, programs, codes, cliArguments, program.payload),
        program.value,
      );
      console.log();
      continue;
    }

    if (tx.type === 'send_message') {
      const program = programs[tx.program];
      const payload = getPayload(accounts, programs, codes, cliArguments, tx.payload);
      logger.info(`Send message ${JSON.stringify(payload)} to ${program.name || program.address || tx.program}`, {
        lvl: 0,
      });
      if (!program.address) {
        throw new Error(`Program ${tx.program} wasn't uploaded`);
      }
      await sendMessage(api, acc, program.address, program.meta, payload, tx.value, tx.increase_gas);
      console.log();
      continue;
    }
  }
}
