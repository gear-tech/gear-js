import { KeyringPair } from '@polkadot/keyring/types';
import { decodeAddress } from '@gear-js/api';

import { ICode, IProgram } from '../types/index.js';

const ACC_REGEX = /\$account \w+/g;
const PROG_REGEX = /\$program \d+/g;
const CODE_REGEX = /\$code \d+/g;
const CLI_REGEX = /\$cli \d+/g;

export function getPayload(
  accounts: Record<string, KeyringPair>,
  programs: Record<number, IProgram>,
  codes: Record<number, ICode>,
  cliArguments: string[],
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
    for (const match of matchProg) {
      const program = programs[Number(match.split(' ')[1])].address;
      stringPayload = stringPayload.replace(match, program);
    }
  }
  if (matchAcc) {
    for (const match of matchAcc) {
      const acc = decodeAddress(accounts[match.split(' ')[1]].address);
      stringPayload = stringPayload.replace(match, acc);
    }
  }
  if (matchCode) {
    for (const match of matchCode) {
      const code = codes[Number(match.split(' ')[1])].hash;
      stringPayload = stringPayload.replace(match, code);
    }
  }
  if (matchCli) {
    for (const match of matchCli) {
      const arg = cliArguments[Number(match.split(' ')[1])];
      stringPayload = stringPayload.replace(match, arg);
    }
  }
  return JSON.parse(stringPayload);
}
