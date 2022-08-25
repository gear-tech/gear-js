import { Column, Entity, PrimaryColumn } from "typeorm";

import { Role } from "../../common/enums";

@Entity()
export class User {
    @PrimaryColumn()
      id: string;

    @Column({ enum: Role })
      role: Role;
}
