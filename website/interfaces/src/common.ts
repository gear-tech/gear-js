export interface IGenesis {
  genesis: string;
}

export interface IBaseDBRecord<Timestamp extends Date | number> extends IGenesis {
  blockHash: string;
  timestamp: Timestamp;
}

export interface ISignature {
  signature: string;
}
