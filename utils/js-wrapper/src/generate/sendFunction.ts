import { IArg } from '../interfaces.js';
import { getArgsNames, getArgsNamesWithType, getType } from './utils.js';

export function generateSendFunc(name: string, ts: boolean, args: IArg[]) {
  return `\n  async ${name.slice(2)}(${[
    ts ? getArgsNamesWithType(args) : getArgsNames(args),
    `gasLimit${getType(': number | string', ts)}`,
    `value${getType(': number | string', ts)}`,
  ].join(', ')})${getType(`: Promise<SubmittableExtrinsic<'promise', ISubmittableResult>>`, ts)} {
    await this.isReady;
    const payload = this.mod.${name}(${getArgsNames(args)});
    return this.api.message.submit({ destination: this.programId, payload, gasLimit, value });
  }`;
}
