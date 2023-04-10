import { KeyringPair } from '@polkadot/keyring/types';
import { decodeAddress } from '@gear-js/api';

import { CLIArguments, ICode, IProgram } from '../types';
import { ACC_REGEX, CLI_REGEX, CODE_REGEX, PROG_REGEX, replaceMatch } from '../common';

export function getPayload(
  accounts: Record<string, KeyringPair>,
  programs: Record<number, IProgram>,
  codes: Record<number, ICode>,
  cliArguments: CLIArguments,
  payload: any,
) {
  if (!payload) {
    return undefined;
  }
  let stringPayload = JSON.stringify(payload);

  const matchAcc = stringPayload.match(ACC_REGEX);
  const matchProg = stringPayload.match(PROG_REGEX);
  const matchCode = stringPayload.match(CODE_REGEX);
  const matchCli = stringPayload.match(CLI_REGEX);

  if (matchProg) {
    stringPayload = replaceMatch(stringPayload, matchProg, programs, 'address', Number);
  }

  if (matchAcc) {
    stringPayload = replaceMatch(stringPayload, matchAcc, accounts, 'address', undefined, decodeAddress);
  }

  if (matchCode) {
    stringPayload = replaceMatch(stringPayload, matchProg, codes, 'hash', Number);
  }

  if (matchCli) {
    stringPayload = replaceMatch(stringPayload, matchCli, cliArguments);
  }
  return JSON.parse(stringPayload);
}
