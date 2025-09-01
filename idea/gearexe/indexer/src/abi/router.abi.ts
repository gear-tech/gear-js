import { LogEvent, FunctionCall } from './abi.support';
import * as ethers from 'ethers';
import * as fs from 'fs';
import { config } from '../config';
import path from 'path';

const ABI_JSON = JSON.parse(fs.readFileSync(path.join(config.apiPath, 'IRouter.json'), 'utf-8'));

export const abi = new ethers.Interface(ABI_JSON.abi);

export const events = {
  BatchCommitted: new LogEvent<[hash: string] & { hash: string }>(abi, abi.getEvent('BatchCommitted')!.topicHash),
  HeadCommitted: new LogEvent<[head: string] & { head: string }>(abi, abi.getEvent('HeadCommitted')!.topicHash),
  CodeGotValidated: new LogEvent<[codeId: string, valid: boolean] & { codeId: string; valid: boolean }>(
    abi,
    abi.getEvent('CodeGotValidated')!.topicHash,
  ),
  CodeValidationRequested: new LogEvent<[codeId: string] & { codeId: string }>(
    abi,
    abi.getEvent('CodeValidationRequested')!.topicHash,
  ),
  NextEraValidatorsCommitted: new LogEvent<[startTimestamp: string] & { startTimestamp: string }>(
    abi,
    abi.getEvent('NextEraValidatorsCommitted')!.topicHash,
  ),
  ComputationSettingsChanged: new LogEvent<
    [threshold: string, wvaraPerSecond: string] & { threshold: string; wvaraPerSecond: string }
  >(abi, abi.getEvent('ComputationSettingsChanged')!.topicHash),
  ProgramCreated: new LogEvent<[actorId: string, codeId: string] & { actorId: string; codeId: string }>(
    abi,
    abi.getEvent('ProgramCreated')!.topicHash,
  ),
  StorageSlotChanged: new LogEvent<[] & {}>(abi, abi.getEvent('StorageSlotChanged')!.topicHash),
};

export const functions = {
  createProgramWithAbiInterface: new FunctionCall<
    [codeId: string, salt: string, overrideInitializer: string, abiInterface: string] & {
      codeId: string;
      salt: string;
      overrideInitializer: string;
      abiInterface: string;
    }
  >(abi, abi.getFunction('createProgramWithAbiInterface')!.selector),
  setMirror: new FunctionCall<[newMirror: string] & { newMirror: string }>(abi, abi.getFunction('setMirror')!.selector),
};
