import { AccountId, ExitCode, MessageId, ProgramId } from './gear-api';

export type HandleKind = 'Init' | 'Handle' | 'Reply';

export interface GetGasSpentOptions {
  /**
   * @description AccountId in hex format
   */
  accountId: AccountId;
  /**
   * @description ProgramId in hex format
   */
  programId: ProgramId;
  /**
   * @description Message payload
   */
  payload: any;
  /**
   * @description Kind of Message
   */
  kind: 'Init' | 'Handle' | 'Reply';
  /**
   * @description `MessageId` and `ExitCode` of a message waiting for a response.
   * - It is required if kind is `Reply`
   */
  kindReplyOptions?: [MessageId, ExitCode];
  /**
   * @description Type of payload.
   * - If it isn't specified. It will be taken from meta depending on the `kind`
   */
  typeOfPayload?: any;
}
