export interface FlowCommand {
    command: string,
    program: string,
    acc?: string,
    payload?: { AddNftContract: string} | string
}
