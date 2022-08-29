interface IBaseTokenInfo {
  nftContractId: string;
  tokenId: number;
}

interface IPrice {
  price: number;
}

interface IFtContract {
  ftContractId?: string;
}

export interface IMarketPlaceDataAdded extends IBaseTokenInfo, Partial<IPrice>, IFtContract {}

export interface IAuctionCreated extends IBaseTokenInfo, IPrice, IFtContract {}

export interface IAuctionSettled extends IBaseTokenInfo, IPrice {
  newOwner: string;
}

export interface IBidAdded extends IBaseTokenInfo, IPrice {}

export interface IItemSold extends IBaseTokenInfo, IPrice {}

export interface IOfferAdded extends IBaseTokenInfo, IPrice, IFtContract {}

export interface IOfferAccepted extends IBaseTokenInfo, IPrice, IFtContract {
  newOwner: string;
}

export interface IOfferCancelled extends IBaseTokenInfo, IPrice, IFtContract {}
