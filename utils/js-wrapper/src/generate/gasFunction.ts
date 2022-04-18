import { IArg } from '../interfaces.js';
import { getArgsNames, getArgsNamesWithType, getType } from './utils.js';

export function generateGasFunc(name: string, ts: boolean, args: IArg[]) {
  return `\n  async calculate_gas_${name.slice(7)}(${[
    `sourceId${getType(': `0x${string}`', ts)}`,
    `value${getType(': number | string', ts)}`,
    ts ? getArgsNamesWithType(args) : getArgsNames(args),
  ].join(', ')})${getType(`: Promise<string>`, ts)} {
    await this.isReady;
    const payload = this.mod.${name}(${getArgsNames(args)});
    const gasSpent = await this.api.program.gasSpent.handle(sourceId, this.programId, payload, value);
    return gasSpent.toHuman();
  }`;
}
