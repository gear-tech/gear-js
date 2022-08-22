import { GearKeyring } from "@gear-js/api";

require("dotenv").config();

export const getAccount = () => Promise.all([
  GearKeyring.fromSuri(process.env.GEAR_ACCOUNT_AL),
  GearKeyring.fromSuri(process.env.GEAR_ACCOUNT_BB),
]);
