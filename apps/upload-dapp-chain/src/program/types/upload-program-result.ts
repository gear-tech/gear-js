import { Program } from "../../common/types";

export interface UploadProgramResult extends Program {
  codeHash?: string
  programId: string
  metaWasmBase64: string
  optWasmBase64: string
}
