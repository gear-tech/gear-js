import { Message } from '../../../database/entities';

const message_1 = new Message();
message_1.id = '0x7350';
message_1.genesis = '0x7350';
message_1.processedWithPanic = false;
message_1.destination = 'message_1';
message_1.payload = 'message_1';

const message_2 = new Message();
message_2.id = '0x7351';
message_2.genesis = '0x7351';
message_2.processedWithPanic = true;
message_2.destination = 'message_2';
message_2.payload = 'message_2';

const message_3 = new Message();
message_3.id = '0x7352';
message_3.genesis = '0x7352';
message_3.processedWithPanic = false;
message_3.destination = 'message_3';
message_3.payload = 'message_3';

const MESSAGE_DB_MOCK = [message_1, message_2, message_3];

export { MESSAGE_DB_MOCK };
