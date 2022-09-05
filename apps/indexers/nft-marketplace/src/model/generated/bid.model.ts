import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {Auction} from "./auction.model"

@Entity_()
export class Bid {
  constructor(props?: Partial<Bid>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => Auction, {nullable: true})
  auction!: Auction

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  price!: bigint
}
