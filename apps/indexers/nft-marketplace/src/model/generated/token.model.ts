import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {NftContract} from "./nftContract.model"
import {Account} from "./account.model"
import {Auction} from "./auction.model"
import {Transfer} from "./transfer.model"
import {Offer} from "./offer.model"

@Index_(["nftContract", "owner"], {unique: false})
@Entity_()
export class Token {
  constructor(props?: Partial<Token>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_("text", {nullable: false})
  tokenId!: string

  @ManyToOne_(() => NftContract, {nullable: true})
  nftContract!: NftContract

  @Index_()
  @ManyToOne_(() => Account, {nullable: true})
  owner!: Account

  @Column_("text", {nullable: false})
  name!: string

  @Column_("text", {nullable: false})
  description!: string

  @Column_("text", {nullable: false})
  media!: string

  @Column_("text", {nullable: false})
  reference!: string

  @Index_()
  @ManyToOne_(() => Auction, {nullable: true})
  auction!: Auction | undefined | null

  @Column_("bool", {nullable: false})
  isListed!: boolean

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  price!: bigint | undefined | null

  @OneToMany_(() => Transfer, e => e.token)
  transfers!: Transfer[]

  @OneToMany_(() => Offer, e => e.token)
  offers!: Offer[]

  @Column_("bool", {nullable: false})
  burnt!: boolean
}
