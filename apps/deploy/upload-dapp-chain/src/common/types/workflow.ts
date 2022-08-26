import { FlowCommand } from "./flow-command";
import { Program } from "./program";

interface WorkflowYamlData {
    programs: {
        [key: string]: Program
    }
    workflow: FlowCommand[]
}

export { WorkflowYamlData };
