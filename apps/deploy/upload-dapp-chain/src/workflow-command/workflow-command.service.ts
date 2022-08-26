import { Injectable, Logger } from "@nestjs/common";

import { decodeAddress, GearApi, getWasmMetadata, Hex, IMessageSendOptions } from "@gear-js/api";
import { checkInitProgram, getAccount, getOptAndMetaWasm } from "../common/hellpers";
import { SendMessageInput, UploadProgramInput, UploadProgramResult } from "./types";
import { gearService } from "../gear/gear-service";
import { sendTransaction } from "../common/hellpers/send-transaction";
import { ApiKey } from "../common/enums";

@Injectable()
export class WorkflowCommandService {
  private logger: Logger = new Logger("WorkflowCommandService");
  private gearApi: GearApi = gearService.getApi();

  constructor() {}

  public async uploadProgram(uploadProgramInput: UploadProgramInput): Promise<UploadProgramResult> {
    const { metaDownloadUrl, optDownloadUrl, acc, payload } = uploadProgramInput;

    const account = await getAccount(acc);
    const sourceId = decodeAddress(account.address);

    const [optWasmData, metaWasmData] = await getOptAndMetaWasm(
      optDownloadUrl,
      metaDownloadUrl,
    );

    const [optWasmBuff, metaWasmBuff] = await Promise.all([
      optWasmData.buffer(),
      metaWasmData.buffer(),
    ]);

    try {
      const meta = await getWasmMetadata(metaWasmBuff);

      const gas = await this.gearApi.program.calculateGas.initUpload(
        sourceId,
        optWasmBuff,
        payload,
        0,
        true,
        meta,
      );

      const program = {
        code: optWasmBuff,
        gasLimit: gas.min_limit,
        value: 0,
        initPayload: payload,
      };

      const { programId } = this.gearApi.program.upload(program, meta);
      const status = checkInitProgram(this.gearApi, programId);
      await sendTransaction(this.gearApi, account, "MessageEnqueued", ApiKey.PROGRAM);

      await status;

      return { ...uploadProgramInput, programId, metaWasmBase64: metaWasmBuff.toString("base64") };
    } catch (error) {
      console.log(error);
      this.logger.error(error);
    }
  }

  public async sendMessage(sendMessageInput: SendMessageInput, uploadPrograms: UploadProgramResult[]): Promise<void> {
    const { payload, acc, program } = sendMessageInput;

    const account = await getAccount(acc);
    const sourceId = decodeAddress(account.address);

    const uploadedProgram = uploadPrograms.find(uploadProgram => uploadProgram.dapp === program.dapp);

    try {
      const buff = Buffer.from(uploadedProgram.metaWasmBase64, "base64");
      const meta = await getWasmMetadata(buff);

      const gas = await this.gearApi.program.calculateGas.handle(
        sourceId,
          uploadedProgram.programId as Hex,
          payload,
          0,
          true,
          meta,
      );

      const message: IMessageSendOptions = {
        destination: uploadedProgram.programId as Hex,
        payload,
        gasLimit: gas.min_limit,
        value: 0,
      };

      const tx = this.gearApi.message.send(message, meta);

      await sendTransaction(this.gearApi, account, "MessageEnqueued", ApiKey.MESSAGE);

      await tx.signAndSend(account, ({ events }) => {
        events.forEach(({ event }) => console.log(event.toHuman()));
      });
    } catch (error) {
      console.error(error);
      this.logger.error(error);
    }
  }
}
