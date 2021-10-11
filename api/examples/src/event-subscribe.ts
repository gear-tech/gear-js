import { GearApi } from '@gear-js/api';
import { LogData, MessageInfo } from '@gear-js/api/types';

async function main() {
  const gearApi = await GearApi.create();

  gearApi.gearEvents.subscribeLogEvents(({ data }) => {
    data.forEach((eventData: LogData) => {
      console.log(`
      Log:
      messageId: ${eventData.id.toHex()}
      from program: ${eventData.source.toHex()}
      to account: ${eventData.dest.toHex()}
      payload: ${eventData.payload.toHuman()}
      ${
        eventData.reply.isSome
          ? `reply to: ${eventData.reply.unwrap()[0].toHex()}
        with error: ${eventData.reply.unwrap()[1].toNumber() === 0 ? false : true}
        `
          : ''
      }
        `);
    });
  });

  gearApi.gearEvents.subscribeProgramEvents(({ data, method }) => {
    data.forEach((eventData: MessageInfo) => {
      console.log(`
      ${method}:
      programId: ${eventData.programId.toHex()}
      initMessageId: ${eventData.messageId.toHex()}
      origin: ${eventData.origin.toHex()}
      `);
    });
  });

  gearApi.gearEvents.subscribeTransferEvents(({ data }) => {
    console.log(`
    Transfer balance:
    from: ${data[0].toHex()}
    to: ${data[1].toHex()}
    value: ${+data[2].toString()}
    `);
  });
}

main();
