import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {Token} from "./token.model"
import {Account} from "./account.model"

@Index_(["token", "account"], {unique: false})
@Entity_()
export class Offer {
  constructor(props?: Partial<Offer>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @ManyToOne_(() => Token, {nullable: true})
  token!: Token

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  price!: bigint

  @Index_()
  @ManyToOne_(() => Account, {nullable: true})
  account!: Account

  @Column_("bool", {nullable: false})
  accepted!: boolean

  @Column_("bool", {nullable: false})
  cancelled!: boolean
}
