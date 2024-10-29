import { Events } from '../../common';
import { Event } from '../../processor';
import { CVoucherIssued, CVoucherUpdated } from '../calls';

export interface AVoucherIssued {
  owner: string;
  spender: string;
  voucherId: string;
}

export type EVoucherIssued = {
  args: AVoucherIssued;
  call?: CVoucherIssued;
} & Omit<Event, 'args' | 'call'>;

export const isVoucherIssued = (event: Event): event is EVoucherIssued => event.name === Events.VoucherIssued;

export interface AVoucherUpdated {
  spender: string;
  voucherId: string;
}

export type EVoucherUpdated = {
  args: AVoucherUpdated;
  call?: CVoucherUpdated;
} & Omit<Event, 'args' | 'call'>;

export type EVoucherDeclined = EVoucherUpdated;
export type EVoucherRevoked = EVoucherUpdated;

export const isVoucherUpdated = (event: Event): event is EVoucherUpdated => event.name === Events.VoucherUpdated;
export const isVoucherDeclined = (event: Event): event is EVoucherDeclined => event.name === Events.VoucherDeclined;
export const isVoucherRevoked = (event: Event): event is EVoucherRevoked => event.name === Events.VoucherRevoked;

export interface ABalanceTransfer {
  from: string;
  to: string;
  amount: string;
}

export type EBalanceTransfer = {
  args: ABalanceTransfer;
} & Omit<Event, 'args'>;

export const isBalanceTransfer = (event: Event): event is EBalanceTransfer => event.name === Events.Transfer;
