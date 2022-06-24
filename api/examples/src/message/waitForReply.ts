import { GearApi, UserMessageSent } from '@gear-js/api';

export function waitForReply(api: GearApi, programId: string): (messageId: string) => Promise<UserMessageSent> {
  const messages = {};
  api.query.system.events((events) => {
    events.forEach(({ event }) => {
      if (api.events.gear.UserMessageSent.is(event)) {
        const {
          data: {
            message: { source, reply },
          },
        } = event as UserMessageSent;
        if (source.eq(programId) && reply.isSome) {
          messages[reply.unwrap()[0].toHex()] = event as UserMessageSent;
        }
      }
    });
  });
  return (messageId: string) => {
    return messages[messageId];
  };
}
