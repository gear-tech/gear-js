import { CLI_REGEX, replaceMatch } from '../common';
import { CLIArguments, IScheme } from '../types';

export function replaceCliArgs(scheme: IScheme, args: CLIArguments) {
  // Find and replace CLI arguments in account definitions
  for (const [key, value] of Object.entries(scheme.accounts)) {
    if (typeof value !== 'string') continue;
    const matchCli = value.match(CLI_REGEX);
    if (matchCli) {
      scheme.accounts[key] = replaceMatch(value, matchCli, args);
    }
  }

  // Find and replace CLI arguments in program definitions
  for (const [pKey, pValue] of Object.entries(scheme.programs)) {
    for (const [key, value] of Object.entries(pValue)) {
      if (typeof value !== 'string') continue;
      const matchCli = value.match(CLI_REGEX);
      if (matchCli) {
        scheme.programs[pKey][key] = replaceMatch(value, matchCli, args);
      }
    }
  }

  // Find and replace CLI arguments in code definitions
  if (scheme.codes) {
    for (const [pKey, pValue] of Object.entries(scheme.codes)) {
      for (const [key, value] of Object.entries(pValue)) {
        if (typeof value !== 'string') continue;
        const matchCli = value.match(CLI_REGEX);
        if (matchCli) {
          scheme.codes[pKey][key] = replaceMatch(value, matchCli, args);
        }
      }
    }
  }
  return scheme;
}
