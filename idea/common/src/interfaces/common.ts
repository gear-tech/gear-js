interface IGenesis {
  genesis: string;
}

interface IDates {
  fromDate: string;
  toDate: string;
}

interface IBaseDBRecord<Timestamp extends Date | number> extends IGenesis {
  blockHash: string;
  timestamp: Timestamp;
}

interface ISignature {
  signature: string;
}

export { IGenesis, IBaseDBRecord, ISignature, IDates };
