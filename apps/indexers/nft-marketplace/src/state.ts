import { assertNotNull } from '@subsquid/substrate-processor';
import { Store } from '@subsquid/typeorm-store';

import { Account, Auction, Bid, NftContract, Offer, Token, Transfer } from './model';
import {
  AcceptOfferHandler,
  AddOfferHandler,
  BurnHandler,
  CancelOfferHandler,
  ItemSoldHandler,
  ListTokenHandler,
  MintHandler,
  NewAuctionHandler,
  NewBidHandler,
  SettleAuctionHandler,
  TransferHandler,
} from './types';

export class BatchState {
  accounts: Map<string, Account>;
  nftContracts: Map<string, NftContract>;
  tokens: Map<string, Token>;
  transfers: Map<string, Transfer>;
  offers: Map<string, Offer>;
  auctions: Map<string, Auction>;
  bids: Map<string, Bid>;

  store: Store;

  newBatch(store: Store) {
    this.store = store;

    this.accounts = new Map<string, Account>();
    this.nftContracts = new Map<string, NftContract>();
    this.tokens = new Map<string, Token>();
    this.transfers = new Map<string, Transfer>();
    this.offers = new Map<string, Offer>();
    this.auctions = new Map<string, Auction>();
    this.bids = new Map<string, Bid>();
  }

  async save() {
    await this.store.save(Array.from(this.accounts.values()));
    await this.store.save(Array.from(this.nftContracts.values()));
    await this.store.save(Array.from(this.tokens.values()));
    await this.store.save(Array.from(this.transfers.values()));
    await this.store.save(Array.from(this.offers.values()));
    await this.store.save(Array.from(this.auctions.values()));
    await this.store.save(Array.from(this.bids.values()));
  }

  async isNft(id: string) {
    if (this.nftContracts.has(id)) {
      return true;
    }
    if (await this.store.findOneBy(NftContract, { id })) {
      return true;
    }
    return false;
  }

  newNftContract(id: string) {
    this.nftContracts.set(id, new NftContract({ id }));
  }

  async getNftContract(id: string): Promise<NftContract> {
    if (this.nftContracts.has(id)) {
      return this.nftContracts.get(id);
    }
    return this.store.findOneBy(NftContract, { id });
  }

  async getOrCreateAccount(id: string): Promise<Account> {
    assertNotNull(id, 'AccountId does not found');
    if (this.accounts.has(id)) {
      return this.accounts.get(id);
    }
    let acc = await this.store.findOneBy(Account, { id });
    if (!acc) {
      acc = new Account({ id });
      this.accounts.set(id, acc);
    }
    return acc;
  }

  async getToken(id: string): Promise<Token> {
    if (this.tokens.has(id)) {
      return this.tokens.get(id);
    }
    return this.store.findOneBy(Token, { id });
  }

  async getAuction(tokenId: string): Promise<Auction> {
    if (this.auctions.has(tokenId)) {
      return this.auctions.get(tokenId);
    }
    return this.store.findOneBy(Auction, { token: { id: tokenId }, isOpened: true });
  }

  async getOffer(tokenId: string, price: number) {
    const id = `${tokenId}-${price}`;
    if (this.offers.has(id)) {
      return this.offers.get(id);
    }
    return this.store.findOneBy(Offer, { token: { id: tokenId }, price: BigInt(price) });
  }

  async mintToken(data: MintHandler) {
    const token = new Token({
      ...data,
      nftContract: await this.getNftContract(data.nftContract),
      owner: await this.getOrCreateAccount(data.owner),
    });
    this.tokens.set(data.id, token);
  }

  async burnToken({ tokenId }: BurnHandler) {
    const token = await this.getToken(tokenId);
    token.burnt = true;
    this.tokens.set(tokenId, token);
  }

  async transferToken(data: TransferHandler) {
    const token = await this.getToken(data.tokenId);
    const transfer = new Transfer({
      ...data,
      token,
      from: data.from ? await this.getOrCreateAccount(data.from) : token.owner,
      to: await this.getOrCreateAccount(data.to),
      price: data.price ? BigInt(data.price) : null,
      timestamp: BigInt(data.timestamp),
    });
    token.owner = transfer.to;
    if (data.price) {
      token.price = null;
    }
    this.transfers.set(data.id, transfer);
    this.tokens.set(token.id, token);
  }

  async listToken(data: ListTokenHandler) {
    const token = await this.getToken(data.tokenId);
    token.isListed = true;
    token.price = data.price ? BigInt(data.price) : null;
    this.tokens.set(token.id, token);
  }

  async itemSold(data: ItemSoldHandler) {
    await this.transferToken({ ...data, to: data.newOwner });
  }

  async newAuction(data: NewAuctionHandler) {
    const token = await this.getToken(data.tokenId);
    const auction = new Auction({
      ...data,
      token,
      finishAt: BigInt(data.timestamp) + BigInt(0),
      price: BigInt(data.price),
      isOpened: true,
    });

    this.tokens.set(token.id, token);
    this.auctions.set(token.id, auction);
  }

  async newBid(data: NewBidHandler) {
    const auction = await this.getAuction(data.tokenId);
    auction.price = BigInt(data.price);
    const bid = new Bid({ ...data, auction, price: auction.price });
    this.auctions.set(data.tokenId, auction);
    this.bids.set(bid.id, bid);
  }

  async settleAuction(data: SettleAuctionHandler) {
    const auction = await this.getAuction(data.tokenId);
    auction.price = BigInt(data.price);
    auction.isOpened = false;
    await this.transferToken({
      id: data.id,
      tokenId: data.tokenId,
      to: data.newOwner,
      price: data.price,
      timestamp: data.timestamp,
    });
    this.auctions.set(data.tokenId, auction);
  }

  async addOffer(data: AddOfferHandler) {
    const token = await this.getToken(data.tokenId);
    const offer = new Offer({
      ...data,
      price: BigInt(data.price),
      token,
      accepted: false,
      cancelled: false,
      account: await this.getOrCreateAccount(data.account),
    });
    this.offers.set(`${token.id}-${data.price}`, offer);
  }

  async acceptOffer(data: AcceptOfferHandler) {
    const offer = await this.getOffer(data.tokenId, data.price);
    offer.accepted = true;
    await this.transferToken({
      id: data.id,
      tokenId: data.tokenId,
      to: data.newOwner,
      price: data.price,
      timestamp: data.timestamp,
    });
    this.offers.set(`${data.tokenId}-${data.price}`, offer);
  }

  async cancelOffer(data: CancelOfferHandler) {
    const offer = await this.getOffer(data.tokenId, data.price);
    offer.cancelled = true;
    this.offers.set(`${data.tokenId}-${data.price}`, offer);
  }
}
