import { Injectable } from "@nestjs/common";

import { WorkflowCommandService } from "../workflow-command/workflow-command.service";
import { DappDataService } from "../dapp-data/dapp-data.service";
import { Role, TBErrorMessage } from "../common/enums";
import { UserService } from "../user/user.service";
import { UserRepo } from "../user/user.repo";
import { getTgCommands } from "../common/helpers";
import { getWorkflowCommands } from "../common/helpers/get-workflow-commands";
import { SendMessageInput, UploadProgramResult } from "../workflow-command/types";
import { getUploadProgramData } from "../common/helpers/get-upload-program-data";
import { DappData } from "../dapp-data/entities/dapp-data.entity";
import { Payload } from "../common/types";
import { getUploadProgramByName } from "../common/helpers/get-upload-program-by-name";

@Injectable()
export class TgbotService {
  constructor(
      private workflowCommandService: WorkflowCommandService,
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
      return "User successfully register";
    }

    return TBErrorMessage.ACCESS_DENIED;
  }

  public async listCommands(userId: number): Promise<string> {
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
      const { acc, payload, command, program, value } = commandInfo;
      const uploadProgramData = getUploadProgramData(program);

      try {
        if (command === "sendMessage") {
          const sendMessageInput: SendMessageInput = {
            payload: this.getPayload(uploadedPrograms, payload),
            program: uploadProgramData,
            acc,
            value,
          };

          await this.workflowCommandService.sendMessage(sendMessageInput, uploadedPrograms);
        }

        if (command === "uploadProgram") {
          const uploadedProgramData = await this.workflowCommandService.uploadProgram(uploadProgramData);
          uploadedPrograms.push(uploadedProgramData);
        }
      } catch (error) {
        console.log(error);
      }
    }

    const dapps = await this.dappDataService.createDappsData(uploadedPrograms);

    return dapps.map(dapp => ({ ...dapp, metaWasmBase64: "long" }));
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

    if(!uploadProgramActions) {
      return TBErrorMessage.INVALID_DAPP_NAME;
    }

    for (const action of uploadProgramActions.actions) {
      const { payload, acc, value, program, command } = action;
      const uploadProgramData = getUploadProgramData(program);

      try {
        if (command === "sendMessage") {
          const sendMessageInput: SendMessageInput = {
            payload: this.getPayload(uploadedPrograms, payload),
            program: uploadProgramData,
            acc,
            value,
          };

          await this.workflowCommandService.sendMessage(sendMessageInput, uploadedPrograms);
        }

        if (command === "uploadProgram") {
          const uploadedProgramData = await this.workflowCommandService.uploadProgram(uploadProgramData);
          uploadedPrograms.push(uploadedProgramData);
        }
      } catch (error) {
        console.log(error);
      }
    }

    const dapps = await this.dappDataService.createDappsData(uploadedPrograms);

    return dapps.map(dapp => ({ ...dapp, metaWasmBase64: "long" }));
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
