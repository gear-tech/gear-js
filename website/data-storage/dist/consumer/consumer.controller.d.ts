import { ConsumerService } from './consumer.service';
export declare class ConsumerController {
  private readonly consumerService;
  constructor(consumerService: ConsumerService);
  addEvent(payload: any): Promise<void>;
  programData(payload: any): Promise<string>;
  allPrograms(payload: any): Promise<string>;
  addMeta(payload: any): Promise<string>;
  getMeta(payload: any): Promise<string>;
  allMessages(payload: any): Promise<string>;
  savePayload(payload: any): Promise<string>;
}
