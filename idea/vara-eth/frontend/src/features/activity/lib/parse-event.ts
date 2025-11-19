import { EventLog } from 'ethers';

import { AllEvents, RouterEvents, WrappedVaraEvents } from '@/app/store';

function parseEvent(eventLog: EventLog): AllEvents | null {
  const { args } = eventLog;
  const event = eventLog.fragment.name;

  if (!event || !args) return null;

  const typedArgs = args as Array<string | boolean | bigint>;

  switch (event) {
    case RouterEvents.programCreated:
      return {
        type: RouterEvents.programCreated,
        actorId: typedArgs[0] as string,
        codeId: typedArgs[1] as string,
      };

    case RouterEvents.codeGotValidated:
      return {
        type: RouterEvents.codeGotValidated,
        codeId: typedArgs[0] as string,
        valid: typedArgs[1] as boolean,
      };

    case RouterEvents.codeValidationRequested:
      return {
        type: RouterEvents.codeValidationRequested,
        codeId: typedArgs[0] as string,
        blobTxHash: typedArgs[1] as string,
      };

    case RouterEvents.blockCommitted:
      return {
        type: RouterEvents.blockCommitted,
        hash: typedArgs[0] as string,
      };

    case WrappedVaraEvents.approval:
      return {
        type: WrappedVaraEvents.approval,
        owner: typedArgs[0] as string,
        spender: typedArgs[1] as string,
        value: typedArgs[2] as string,
      };

    case WrappedVaraEvents.transfer:
      return {
        type: WrappedVaraEvents.transfer,
        from: typedArgs[0] as string,
        to: typedArgs[1] as string,
        value: typedArgs[2] as string,
      };

    default:
      return null;
  }
}

export { parseEvent };
