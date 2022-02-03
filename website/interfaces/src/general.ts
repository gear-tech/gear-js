export interface IGenesis {
  genesis: string;
}

export interface IBaseDBRecord<Timestamp extends Date | number> extends IGenesis {
  blockHash?: string;
  timestamp?: Timestamp;
}

export interface ISignature {
  signature: string;
}

export interface IMessageInfo {
  programId: `0x${string}`;
  messageId: `0x${string}`;
  origin: `0x${string}`;
}
