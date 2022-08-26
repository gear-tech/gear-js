import { load } from "js-yaml";
import { readFileSync } from "fs";
import { WorkflowYamlData } from "../types";
import { Program } from "../types/program";

export function getUploadProgramData(programNum: string): Program {
  const pathWorkflowYaml = process.env.WORKFLOW_PATH as string;
  // eslint-disable-next-line no-path-concat
  const workflowYamlData = load(readFileSync(__dirname + pathWorkflowYaml, "utf8")) as WorkflowYamlData;

  return workflowYamlData.programs[programNum];
}
