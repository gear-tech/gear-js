import { Injectable, Logger } from "@nestjs/common";
import { GearApi, generateCodeId } from "@gear-js/api";

import { getAccount, getOptAndMetaWasm, sendTransaction } from "../common/helpers";
import { gearService } from "../gear/gear-service";
import { UploadCodeInput } from "./types";
import { UploadProgramResult } from "../program/types";

@Injectable()
export class CodeService {
  private logger: Logger = new Logger(CodeService.name);
  private gearApi: GearApi = gearService.getApi();

  constructor() {}

  public async upload(uploadCodeInput: UploadCodeInput): Promise<UploadProgramResult> {
    const { metaDownloadUrl, optDownloadUrl, acc } = uploadCodeInput;

    const [optWasmData, metaWasmData] = await getOptAndMetaWasm(
      optDownloadUrl,
      metaDownloadUrl,
    );

    const [optWasmBuff, metaWasmBuff] = await Promise.all([
      optWasmData.buffer(),
      metaWasmData.buffer(),
    ]);

    const result = {
      ...uploadCodeInput,
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
      this.logger.error(`Upload code error: ${uploadCodeInput.dapp}`);
      console.log("opt_wasm", optWasmBuff);
      console.log("meta_wasm", metaWasmBuff);
      console.log(error);

      result.codeHash = generateCodeId(optWasmBuff);
      return result;
    }
  }
}
