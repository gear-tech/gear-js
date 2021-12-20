import { Consumer, Kafka, KafkaMessage, Producer } from 'kafkajs';
import { DbService } from './db';
import { GearService } from './gear';
export declare class KafkaConsumer {
  kafka: Kafka;
  consumer: Consumer;
  gearService: GearService;
  dbService: DbService;
  producer: Producer;
  constructor(gearService: GearService, dbService: DbService);
  connect(): Promise<void>;
  sendReply(message: any, value: string): void;
  messageProcessing(message: KafkaMessage): Promise<void>;
  subscribe(topic: string): Promise<void>;
}
