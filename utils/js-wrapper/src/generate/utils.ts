import { IArg } from '../interfaces.js';

/**
 *
 * @param {Function} func
 */
export function getFunctionArgs(func: Function) {
  const stringFunc = func.toString();
  const startI = stringFunc.indexOf('(') + 1;
  const endI = stringFunc.indexOf(')');
  const sliced = stringFunc.slice(startI, endI);
  return sliced.length > 0 ? sliced.split(',').map((value) => value.trim()) : [];
}

export function getFunctionsNames(module: any) {
  return Object.keys(module).filter((key) => !['default', '__wasm'].includes(key));
}

export function getFuncSignature(functionName: string, dTsFile: string) {
  const funcIndex = dTsFile.indexOf(functionName);
  const signature = dTsFile.slice(funcIndex).match(/\(.*\): \w*;/)[0];
  const args =
    signature.match(/\w+: \w+/g)?.map((value) => {
      const splitted = value.split(': ');
      return { [splitted[0]]: splitted[1] };
    }) || null;
  const resultType = signature.match(/\): \w+/g)[0].slice(3);
  return {
    args,
    resultType,
  };
}

export function getArgsNames(args: IArg[]) {
  if (args === null) {
    return '';
  }
  return args.map((arg) => Object.keys(arg)[0]).join(', ');
}

export function getArgsNamesWithType(args: IArg[]) {
  if (args === null) {
    return '';
  }
  return args.map((arg) => `${Object.keys(arg)[0]}: ${Object.values(arg)[0]}`).join(', ');
}

export function getType(value: string, ts: boolean) {
  return ts ? value : '';
}
