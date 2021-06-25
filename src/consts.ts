import { SocketService } from './services/SocketService';

export const GEAR_STORAGE_KEY = "gear_user_token";
export const GEAR_MNEMONIC_KEY = "gear_mnemonic";
export const GEAR_LOCAL_WS_URI = "ws://localhost:3000/api/ws";

export const GEAR_BALANCE_TRANSFER_VALUE = 4324239999;

export const emitEvents = {
    uploadProgram: "uploadProgram",
    subscribeNewBlocks: "subscribeNewBlocks",
    totalIssuance: "totalIssuance"
}

export const socketService = new SocketService()
