import { Injectable, Logger } from "@nestjs/common";
import { decodeAddress, GearApi, getWasmMetadata } from "@gear-js/api";

import { gearService } from "../gear/gear-service";
import { checkInitProgram, getAccount, getOptAndMetaWasm, sendTransaction } from "../common/helpers";
import { UploadProgramInput, UploadProgramResult } from "./types";

@Injectable()
export class ProgramService {
  private logger: Logger = new Logger(ProgramService.name);
  private gearApi: GearApi = gearService.getApi();

  constructor() {}

  public async upload(uploadProgramInput: UploadProgramInput): Promise<UploadProgramResult> {
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
      const increaseCalculatedGasToTwentyPercent = 1.2;

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
        gasLimit: gas.min_limit.muln(increaseCalculatedGasToTwentyPercent),
        value,
        initPayload: payload,
      };

      const data = this.gearApi.program.upload(program, meta);
      const status = checkInitProgram(this.gearApi, data.programId)
        .catch(error => console.error(`Check init program error: ${uploadProgramInput.dapp}`, error));

      await sendTransaction(data.extrinsic, account, "MessageEnqueued");

      await status;

      return {
        ...uploadProgramInput,
        programId: data.programId,
        metaWasmBase64: metaWasmBuff.toString("base64"),
        optWasmBase64: optWasmBuff.toString("base64"),
      };
    } catch (error) {
      this.logger.error(`Upload program error: ${uploadProgramInput.dapp}`);
      console.log("opt_wasm", optWasmBuff);
      console.log("meta_wasm", metaWasmBuff);
      console.log(error);
    }
  }
}
