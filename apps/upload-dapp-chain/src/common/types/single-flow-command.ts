import { FlowCommand } from "./flow-command";

export interface SingleFlowCommand {
  dappName: string,
  actions: FlowCommand[],
}
