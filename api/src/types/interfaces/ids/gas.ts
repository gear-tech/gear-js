import { Enum } from '@polkadot/types';
import { Hash } from '@polkadot/types/interfaces';

export type ReservationId = Hash;

export interface GasNodeId<T, U> extends Enum {
  isNode: boolean;
  asNode: { Node: T };
  isReservation: boolean;
  asReservation: { Reservation: U };
}
