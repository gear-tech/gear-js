export interface IGenesis {
  genesis: string;
}

export interface IDates {
  fromDate?: string;
  toDate?: string;
}

export interface IBaseDBRecord<Timestamp extends Date | number> extends IGenesis {
  blockHash: string;
  timestamp: Timestamp;
}

export interface ISignature {
  signature: string;
}

export interface SearchParam {
  query?: string;
}
