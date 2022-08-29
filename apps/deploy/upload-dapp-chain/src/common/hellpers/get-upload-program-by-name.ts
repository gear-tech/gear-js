import { load } from "js-yaml";
import { readFileSync } from "fs";
import { FlowCommand, WorkflowYamlData } from "../types";

export function getUploadProgramByName(dappName: string): { actions:FlowCommand[] } {
  const pathWorkflowYaml = process.env.WORKFLOW_PATH as string;
  // eslint-disable-next-line no-path-concat
  const workflowYamlData = load(readFileSync(__dirname + pathWorkflowYaml, "utf8")) as WorkflowYamlData;

  return workflowYamlData.workflowSingleDapp[dappName];
}
