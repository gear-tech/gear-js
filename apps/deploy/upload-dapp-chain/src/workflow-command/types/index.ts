import { Program } from "../../common/types";

interface UploadProgramInput extends Program{}

interface SendMessageInput {
    program: Program
    acc: string
    payload: { [key: string]: string } | string
}

interface UploadProgramResult extends Program {
    programId: string
    metaWasmBase64: string
}

export { UploadProgramInput, SendMessageInput, UploadProgramResult };
