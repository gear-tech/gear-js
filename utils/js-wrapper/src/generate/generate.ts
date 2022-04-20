import { IFunction, Target } from '../interfaces.js';
import { generateClass } from './class.js';
import { generateConstructor } from './constructor.js';
import { generateDecodeFunc } from './decodeFunction.js';
import { generateGasFunc } from './gasFunction.js';
import { generateInitMethod } from './initMethod.js';
import { generateSendFunc } from './sendFunction.js';
import { generateStateFunc } from './stateFunction.js';

export function generate(className: string, functions: IFunction[], ts: boolean, target: Target): string {
  const generatedFunctions = [];
  generatedFunctions.push(generateConstructor(ts, target));
  generatedFunctions.push(generateInitMethod(target));
  functions.forEach(({ name, args, resultType }) => {
    if (name.startsWith('__decode')) {
      generatedFunctions.push(generateDecodeFunc(name, ts, args, resultType));
    } else if (name.startsWith('__send')) {
      generatedFunctions.push(generateSendFunc(name, ts, args));
      generatedFunctions.push(generateGasFunc(name, ts, args));
    } else if (name.startsWith('__query')) {
      generatedFunctions.push(generateStateFunc(name, ts, args, resultType));
    }
  });
  return generateClass(className, ts, generatedFunctions, target);
}
