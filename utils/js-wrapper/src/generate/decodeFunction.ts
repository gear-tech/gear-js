import { IArg } from 'interfaces';
import { getArgsNames, getArgsNamesWithType, getType } from './utils.js';

export function generateDecodeFunc(name: string, ts: boolean, args: IArg[], resultType: string) {
  return `\n  async ${name.slice(2)}(${ts ? getArgsNamesWithType(args) : getArgsNames(args)})${getType(
    `: Promise<${resultType}>`,
    ts,
  )} {
    await this.isReady;
    return JSON.parse(this.mod.${name}(${getArgsNames(args)}));
  }`;
}
