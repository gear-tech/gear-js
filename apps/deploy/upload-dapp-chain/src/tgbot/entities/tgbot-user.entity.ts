import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class TgbotUser {
  @PrimaryColumn()
  id: string;
}
