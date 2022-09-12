import { Injectable, Logger } from "@nestjs/common";
import { decodeAddress, GearApi, generateCodeId, getWasmMetadata, Hex, IMessageSendOptions } from "@gear-js/api";

import { checkInitProgram, getAccount, getOptAndMetaWasm, sendTransaction } from "../common/helpers";
import { SendMessageInput, SubmitCodeInput, UploadProgramInput, UploadProgramResult } from "./types";
import { gearService } from "../gear/gear-service";

@Injectable()
export class CommandService {
  private logger: Logger = new Logger("CommandService");
  private gearApi: GearApi = gearService.getApi();

  constructor() {
  }

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
      const value = uploadProgramInput.value ? uploadProgramInput.value : undefined;

      const gas = await this.gearApi.program.calculateGas.initUpload(
        sourceId,
        optWasmBuff,
        payload,
        value,
        true,
        meta,
      );

      const program = {
        code: optWasmBuff,
        gasLimit: gas.min_limit,
        value,
        initPayload: payload,
      };

      const data = this.gearApi.program.upload(program, meta);
      const status = checkInitProgram(this.gearApi, data.programId);
      await sendTransaction(data.extrinsic, account, "MessageEnqueued");

      await status;

      return {
        ...uploadProgramInput,
        programId: data.programId,
        metaWasmBase64: metaWasmBuff.toString("base64"),
        optWasmBase64: optWasmBuff.toString("base64"),
      };
    } catch (error) {
      console.log("____>optWasmBuff", optWasmBuff);
      console.log("____>metaWasmBuff", metaWasmBuff);
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
      const value = sendMessageInput.value ? sendMessageInput.value : undefined;

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
        gasLimit: gas.min_limit,
        value,
      };

      const extrinsic = this.gearApi.message.send(message, meta);

      await sendTransaction(extrinsic, account, "MessageEnqueued");
    } catch (error) {
      console.error(error);
      this.logger.error(error);
    }
  }

  public async uploadCode(submitCodeInput: SubmitCodeInput): Promise<UploadProgramResult> {
    const { metaDownloadUrl, optDownloadUrl, acc } = submitCodeInput;

    const [optWasmData, metaWasmData] = await getOptAndMetaWasm(
      optDownloadUrl,
      metaDownloadUrl,
    );

    const [optWasmBuff, metaWasmBuff] = await Promise.all([
      optWasmData.buffer(),
      metaWasmData.buffer(),
    ]);

    const result = {
      ...submitCodeInput,
      codeHash: "",
      programId: "",
      metaWasmBase64: metaWasmBuff.toString("base64"),
      optWasmBase64: optWasmBuff.toString("base64"),
    };

    try {
      const account = await getAccount(acc);
      const { codeHash } = await this.gearApi.code.upload(optWasmBuff);

      await sendTransaction(this.gearApi.code, account, "CodeChanged");
      result.codeHash = codeHash;

      return result;
    } catch (error) {
      console.log("____>optWasmBuff", optWasmBuff);
      console.log("____>metaWasmBuff", metaWasmBuff);
      console.log(error);
      this.logger.error(error);

      result.codeHash = generateCodeId(optWasmBuff);
      return result;
    }
  }
}
