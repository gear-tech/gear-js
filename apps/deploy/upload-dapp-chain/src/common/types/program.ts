import { Payload } from "./paylaod";

export interface Program {
    dapp: string
    repo: string
    optDownloadUrl: string
    metaDownloadUrl: string
    acc: string
    payload: Payload
}
