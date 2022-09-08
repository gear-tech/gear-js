import { Program } from "../../common/types";

interface UploadProgramInput extends Program{}

interface SubmitCodeInput extends Program{}

interface SendMessageInput {
    program: Program
    acc: string
    payload: { [key: string]: string } | string | undefined
    value: number | null
}

interface UploadProgramResult extends Program {
    programId: string
    metaWasmBase64: string
    optWasmBase64: string
}

export { UploadProgramInput, SendMessageInput, UploadProgramResult, SubmitCodeInput };
