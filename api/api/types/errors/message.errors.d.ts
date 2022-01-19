import { GearError } from '.';
export declare class SendMessageError extends GearError {
  name: string;
  constructor(message?: string);
}
export declare class SendReplyError extends GearError {
  name: string;
  constructor(message?: string);
}
