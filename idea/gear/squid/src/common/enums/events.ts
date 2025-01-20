export const enum Events {
  MessageQueued = 'Gear.MessageQueued',
  UserMessageSent = 'Gear.UserMessageSent',
  UserMessageRead = 'Gear.UserMessageRead',
  MessagesDispatched = 'Gear.MessagesDispatched',
  ProgramChanged = 'Gear.ProgramChanged',
  CodeChanged = 'Gear.CodeChanged',
  VoucherIssued = 'GearVoucher.VoucherIssued',
  VoucherUpdated = 'GearVoucher.VoucherUpdated',
  VoucherRevoked = 'GearVoucher.VoucherRevoked',
  VoucherDeclined = 'GearVoucher.VoucherDeclined',
  Transfer = 'Balances.Transfer',
}
