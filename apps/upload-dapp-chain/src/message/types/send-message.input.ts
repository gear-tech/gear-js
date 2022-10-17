import { Program } from "../../common/types";

export interface SendMessageInput {
  program: Program
  acc: string
  payload: { [key: string]: string } | string | undefined
  value: number | null
}
