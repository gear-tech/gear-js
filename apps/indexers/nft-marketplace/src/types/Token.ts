export interface IToken {
  tokenId: string;
  owner: string;
  tokenMetadata: {
    name: string;
    description: string;
    media: string;
    reference: string;
  };
}

export interface ITransfer {
  from: string;
  to: string;
  tokenId: number;
}
