import { Injectable, Logger } from "@nestjs/common";
import { decodeAddress, GearApi, getWasmMetadata, Hex, IMessageSendOptions } from "@gear-js/api";

import { gearService } from "../gear/gear-service";
import { getAccount, sendTransaction } from "../common/helpers";
import { SendMessageInput } from "./types/send-message.input";
import { UploadProgramResult } from "../program/types";

@Injectable()
export class MessageService {
  private logger: Logger = new Logger(MessageService.name);
  private gearApi: GearApi = gearService.getApi();

  constructor() {}

  public async send(sendMessageInput: SendMessageInput, uploadPrograms: UploadProgramResult[]): Promise<void> {
    const { payload, acc, program } = sendMessageInput;

    const account = await getAccount(acc);
    const sourceId = decodeAddress(account.address);

    const uploadedProgram = uploadPrograms.find(uploadProgram => uploadProgram.dapp === program.dapp);

    try {
      const buff = Buffer.from(uploadedProgram.metaWasmBase64, "base64");
      const meta = await getWasmMetadata(buff);
      const value = sendMessageInput.value ? sendMessageInput.value : undefined;
      const increaseCalculatedGasToTwentyPercent = 1.2;

      const gas = await this.gearApi.program.calculateGas.handle(
        sourceId,
        uploadedProgram.programId as Hex,
        payload,
        value,
        true,
        meta,
      );

      const message: IMessageSendOptions = {
        destination: uploadedProgram.programId as Hex,
        payload,
        gasLimit: gas.min_limit.muln(increaseCalculatedGasToTwentyPercent),
        value,
      };

      const extrinsic = this.gearApi.message.send(message, meta);

      await sendTransaction(extrinsic, account, "MessageEnqueued");
      this.logger.log(`Message successfully sent to ${uploadedProgram.programId}`);
    } catch (error) {
      this.logger.error(`Send message error: ${sendMessageInput.program}`);
      console.error(error);
    }
  }
}
