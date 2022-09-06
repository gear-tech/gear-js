import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, OneToMany as OneToMany_} from "typeorm"
import {Token} from "./token.model"

@Entity_()
export class NftContract {
  constructor(props?: Partial<NftContract>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @OneToMany_(() => Token, e => e.nftContract)
  tokens!: Token[]
}
