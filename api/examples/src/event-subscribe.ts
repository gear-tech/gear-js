import { GearApi } from '@gear-js/api';

async function main() {
  const gearApi = await GearApi.create();

  gearApi.gearEvents.subscribeLogEvents(({ data: { id, source, dest, payload, reply } }) => {
    console.log(`
      Log:
      messageId: ${id.toHex()}
      from program: ${source.toHex()}
    to account: ${dest.toHex()}
    payload: ${payload.toHuman()}
    ${
      reply.isSome
        ? `reply to: ${reply.unwrap()[0].toHex()}
      with error: ${reply.unwrap()[1].toNumber() === 0 ? false : true}
      `
        : ''
    }
    `);
  });

  gearApi.gearEvents.subscribeProgramEvents(({ method, data: { info, reason } }) => {
    console.log(`
      ${method}:
      programId: ${info.programId.toHex()}
      initMessageId: ${info.messageId.toHex()}
      origin: ${info.origin.toHex()}
      ${reason ? `reason: ${reason.toHuman()}` : ''}
      `);
  });

  gearApi.gearEvents.subscribeTransferEvents(({ data: { from, to, value } }) => {
    console.log(`
    Transfer balance:
    from: ${from.toHex()}
    to: ${to.toHex()}
    value: ${+value.toString()}
    `);
  });
}

main();
