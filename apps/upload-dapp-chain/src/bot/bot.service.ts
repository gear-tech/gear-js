import { Injectable, Logger } from "@nestjs/common";

import { DappDataService } from "../dapp-data/dapp-data.service";
import { Role, TBErrorMessage } from "../common/enums";
import { UserService } from "../user/user.service";
import { UserRepo } from "../user/user.repo";
import { getTgCommands, updateProgramDataByReleaseRepo } from "../common/helpers";
import { getWorkflowCommands } from "../common/helpers/get-workflow-commands";
import { getUploadProgramData } from "../common/helpers/get-upload-program-data";
import { DappData } from "../dapp-data/entities/dapp-data.entity";
import { FlowCommand, Payload } from "../common/types";
import { getUploadProgramByName } from "../common/helpers/get-upload-program-by-name";
import { CodeService } from "../code/code.service";
import { MessageService } from "../message/message.service";
import { ProgramService } from "../program/program.service";
import { UploadProgramResult } from "../program/types";
import { UploadCodesResult } from "../code/types";
import { SendMessageInput } from "../message/types/send-message.input";

@Injectable()
export class BotService {
  private logger: Logger = new Logger(BotService.name);
  constructor(
      private codeService: CodeService,
      private messageService: MessageService,
      private programService: ProgramService,
      private dappDataService: DappDataService,
      private userService: UserService,
      private userRepository: UserRepo,
  ) {}

  public async addAccessUser(commandArguments: string, userId: number): Promise<string> {
    const [, id] = commandArguments.split(" ");

    if (await this.userService.isAdmin(String(userId))) {
      if (!id) {
        return TBErrorMessage.COMMAND_ARGUMENTS_REQUIRED;
      }
      const user = await this.userRepository.get(id);

      if (user) {
        return "User already exists";
      }

      await this.userService.creatUser({ id, role: Role.DEV });
      return "✅ User successfully register";
    }

    return TBErrorMessage.ACCESS_DENIED;
  }

  public async commands(userId: number): Promise<string> {
    if (await this.userService.validate(String(userId))) {
      return getTgCommands();
    }

    return TBErrorMessage.ACCESS_DENIED;
  }

  public async uploadDapps(userId: number): Promise<DappData[] | string> {
    const workflow = getWorkflowCommands();
    const uploadedPrograms: UploadProgramResult[] = [];

    if (!await this.userService.validate(String(userId))) {
      return TBErrorMessage.ACCESS_DENIED;
    }

    for (const commandInfo of workflow) {
      if (commandInfo.command !== "uploadCode") {
        const uploadedProgram = await this.handleCommand(commandInfo, uploadedPrograms);
        if (uploadedProgram) uploadedPrograms.push(uploadedProgram);
      }
    }
    try {
      const dapps = await this.dappDataService.createDappsData(uploadedPrograms);

      return dapps.map(dapp => ({ ...dapp, metaWasmBase64: "long", optWasmBase64: "long" }));
    } catch (error) {
      this.logger.error("Upload dapps bot command error");
      console.log(error);

      return JSON.stringify(error);
    }
  }

  public async uploadCodes(userId: number): Promise<DappData[] | string> {
    const workflow = getWorkflowCommands();
    const uploadedCodes: UploadCodesResult[] = [];

    if (!await this.userService.validate(String(userId))) {
      return TBErrorMessage.ACCESS_DENIED;
    }

    for (const commandInfo of workflow) {
      if (commandInfo.command === "uploadCode") {
        const uploadCode = await this.handleCommand(commandInfo, uploadedCodes);
        if (uploadCode) uploadedCodes.push(uploadCode);
      }
    }

    try {
      const dapps = await this.dappDataService.createDappsData(uploadedCodes);

      return dapps.map(dapp => ({ ...dapp, metaWasmBase64: "long", optWasmBase64: "long" }));
    } catch (error) {
      this.logger.error("Upload codes bot command error");
      console.log(error);

      return JSON.stringify(error);
    }
  }

  public async uploadDapp(userId: number, commandArguments: string): Promise<DappData[] | string> {
    const [, dappName] = commandArguments.split(" ");
    if (!await this.userService.validate(String(userId))) {
      return TBErrorMessage.ACCESS_DENIED;
    }

    if (!dappName) {
      return TBErrorMessage.COMMAND_ARGUMENTS_REQUIRED;
    }

    const uploadProgramActions = getUploadProgramByName(dappName);
    const uploadedPrograms: UploadProgramResult[] = [];

    if (!uploadProgramActions) {
      return TBErrorMessage.INVALID_DAPP_NAME;
    }

    if (uploadProgramActions.actions.find(action => action.command === "uploadCode")) {
      return TBErrorMessage.INVALID_DAPP_NAME;
    }

    for (const action of uploadProgramActions.actions) {
      const uploadedProgram = await this.handleCommand(action, uploadedPrograms);

      if (uploadedProgram) uploadedPrograms.push(uploadedProgram);
    }

    try {
      const dapps = await this.dappDataService.createDappsData(uploadedPrograms);

      return dapps.map(dapp => ({ ...dapp, metaWasmBase64: "long", optWasmBase64: "long" }));
    } catch (error) {
      this.logger.error("Upload dapp bot command error");
      console.log(error);

      return JSON.stringify(error);
    }
  }

  public async uploadCode(userId: number, commandArguments: string): Promise<DappData[] | string> {
    const [, dappName] = commandArguments.split(" ");

    if (!await this.userService.validate(String(userId))) {
      return TBErrorMessage.ACCESS_DENIED;
    }

    if (!dappName) {
      return TBErrorMessage.COMMAND_ARGUMENTS_REQUIRED;
    }

    const uploadProgramActions = getUploadProgramByName(dappName);
    const uploadedPrograms: UploadProgramResult[] = [];

    if (!uploadProgramActions) {
      return TBErrorMessage.INVALID_DAPP_NAME;
    }

    if (uploadProgramActions.actions.find(action => action.command !== "uploadCode")) {
      return TBErrorMessage.INVALID_DAPP_NAME;
    }

    for (const action of uploadProgramActions.actions) {
      const uploadedProgram = await this.handleCommand(action, uploadedPrograms);

      if (uploadedProgram) uploadedPrograms.push(uploadedProgram);
    }

    try {
      const dapps = await this.dappDataService.createDappsData(uploadedPrograms);

      return dapps.map(dapp => ({ ...dapp, metaWasmBase64: "long", optWasmBase64: "long" }));
    } catch (error) {
      this.logger.error("Upload code bot command error");
      console.log(error);

      return JSON.stringify(error);
    }
  }

  public async updateWasmUrlsWorkflow(userId: number): Promise<string> {
    if (await this.userService.isAdmin(String(userId))) {
      try {
        await updateProgramDataByReleaseRepo();

        return "✅ Successfully updated programs meta.wasm and opt.wasm download urls";
      } catch (error) {
        this.logger.error("Update workflow file error");
        console.log(error);

        return JSON.stringify(error);
      }
    }

    return TBErrorMessage.ACCESS_DENIED;
  }

  private async handleCommand(
    flowCommand: FlowCommand,
    uploadedPrograms: UploadProgramResult[],
  ): Promise<UploadProgramResult | void> {
    const { acc, payload, command, program, value } = flowCommand;

    const uploadProgramData = getUploadProgramData(program);

    try {
      if (command === "sendMessage") {
        const sendMessageInput: SendMessageInput = {
          payload: this.getPayload(uploadedPrograms, payload),
          program: uploadProgramData,
          acc,
          value,
        };

        await this.messageService.send(sendMessageInput, uploadedPrograms);
        return;
      }

      if (command === "uploadProgram") {
        return this.programService.upload(uploadProgramData);
      }

      if (command === "uploadCode") {
        return this.codeService.upload(uploadProgramData);
      }
    } catch (error) {
      this.logger.error("Handle commands error");
      this.logger.error(`Program: ${uploadProgramData.dapp}`);
      console.log(error);
    }
  }

  private getPayload(uploadProgramsData: UploadProgramResult[], payload: Payload): Payload {
    // @ts-ignore
    if (payload.AddNftContract) {
      // @ts-ignore
      const program = getUploadProgramData(payload.AddNftContract);
      const uploadedProgram = uploadProgramsData.find(uploadProgram => uploadProgram.dapp === program.dapp);

      return { AddNftContract: uploadedProgram.programId };
    }

    return payload;
  }
}
