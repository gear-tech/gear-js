import { Entity, PrimaryColumn } from "typeorm";

@Entity()
export class TgbotUser {
  @PrimaryColumn()
  id: string;
}
