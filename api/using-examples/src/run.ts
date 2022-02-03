import { typeStructure } from './create-type';
import { debugMode } from './debug-mode';
import { events } from './event-subscribe';
import { messageReply } from './message-reply';
import { readMailbox } from './read-mailbox';
import { uploadProgram } from './upload-program';

const examples = {
  mailbox: readMailbox,
  reply: messageReply,
  events: events,
  debug: debugMode,
  typeStruct: typeStructure,
  uploadProgram: uploadProgram,
};

const run = () => {
  const example = process.argv.slice(2)[0];
  examples[example]()
    .catch((error) => console.log(error))
    .finally(() => process.exit());
};

run();
