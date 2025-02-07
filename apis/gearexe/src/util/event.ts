import { EventLog } from 'ethers';

export function convertEventParams<T>(event: EventLog): T {
  const result: any = {};
  for (let index = 0; index < event.fragment.inputs.length; index++) {
    const input = event.fragment.inputs[index];
    result[input.name] = event.args[index];
  }
  return result;
}
