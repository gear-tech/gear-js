type HumanTypesRepr = {
  input?: number;
  output?: number;
};

export interface IMetaData {
  init: HumanTypesRepr;
  handle: HumanTypesRepr;
  reply: HumanTypesRepr;
  others: HumanTypesRepr;
  signal: number | null;
  state: number | null;
}

export interface IMeta {
  id: string;
  hex: string;
  types: IMetaData | string,
}
