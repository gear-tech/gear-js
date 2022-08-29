export interface FlowCommand {
    command: string,
    program: string,
    acc?: string,
    payload?: { [key: string]: string} | string
    value: null | number
}
