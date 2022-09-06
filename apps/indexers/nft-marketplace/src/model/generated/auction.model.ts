import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {Token} from "./token.model"
import {Bid} from "./bid.model"

@Entity_()
export class Auction {
  constructor(props?: Partial<Auction>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => Token, {nullable: true})
  token!: Token

  @Column_("text", {nullable: true})
  ftContract!: string | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  finishAt!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  price!: bigint

  @OneToMany_(() => Bid, e => e.auction)
  bids!: Bid[]

  @Column_("bool", {nullable: false})
  isOpened!: boolean
}
