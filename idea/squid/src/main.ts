import { TypeormDatabase, Store } from '@subsquid/typeorm-store';

import { processor, ProcessorContext } from './processor';
import { TempState } from './temp-state';
import {
  isCodeChanged,
  isMessageQueued,
  isMessagesDispatched,
  isProgramChanged,
  isUserMessageRead,
  isUserMessageSent,
} from './types';
import {
  handleCodeChanged,
  handleMessageQueued,
  handleMessagesDispatched,
  handleProgramChanged,
  handleUserMessageRead,
  handleUserMessageSent,
  IHandleEventProps,
} from './event.route';

let tempState: TempState;

const callHandlers: Array<{ pattern: (obj: any) => boolean; handler: (args: IHandleEventProps) => Promise<void> }> = [
  { pattern: isMessageQueued, handler: handleMessageQueued },
  { pattern: isUserMessageSent, handler: handleUserMessageSent },
  { pattern: isProgramChanged, handler: handleProgramChanged },
  { pattern: isCodeChanged, handler: handleCodeChanged },
  { pattern: isMessagesDispatched, handler: handleMessagesDispatched },
  { pattern: isUserMessageRead, handler: handleUserMessageRead },
];

const handler = async (ctx: ProcessorContext<Store>) => {
  tempState.newState(ctx);

  for (const block of ctx.blocks) {
    const common = {
      timestamp: new Date((block.header as any).timestamp),
      blockHash: block.header.hash,
      blockNumber: block.header.height.toString(),
    };

    for (const event of block.events) {
      const { handler } = callHandlers.find(({ pattern }) => pattern(event));

      if (!handler) {
        continue;
      }

      await handler({ block, common, ctx, event, tempState });
    }
  }

  await tempState.save();
};

const main = async () => {
  tempState = new TempState();
  processor.run(new TypeormDatabase({ supportHotBlocks: true }), handler);
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
