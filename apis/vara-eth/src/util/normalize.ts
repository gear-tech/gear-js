export function normalizeDispatch(d: any): void {
  d.value = BigInt(d.value);
}

export function normalizeStateTransition(t: any): void {
  t.valueToReceive = BigInt(t.valueToReceive);
  for (const claim of t.valueClaims) claim.value = BigInt(claim.value);
  for (const msg of t.messages) msg.value = BigInt(msg.value);
}

export function normalizeBlockEvent(e: any): void {
  if ('Router' in e) {
    const inner = e.Router;
    if ('ComputationSettingsChanged' in inner) {
      inner.ComputationSettingsChanged.threshold = BigInt(inner.ComputationSettingsChanged.threshold);
      inner.ComputationSettingsChanged.wvaraPerSecond = BigInt(inner.ComputationSettingsChanged.wvaraPerSecond);
    }
    if ('ValidatorsCommittedForEra' in inner) {
      inner.ValidatorsCommittedForEra.eraIndex = BigInt(inner.ValidatorsCommittedForEra.eraIndex);
    }
  }
  if ('Mirror' in e) {
    const ev = e.Mirror.event;
    if ('OwnedBalanceTopUpRequested' in ev)
      ev.OwnedBalanceTopUpRequested.value = BigInt(ev.OwnedBalanceTopUpRequested.value);
    if ('ExecutableBalanceTopUpRequested' in ev)
      ev.ExecutableBalanceTopUpRequested.value = BigInt(ev.ExecutableBalanceTopUpRequested.value);
    if ('MessageQueueingRequested' in ev) ev.MessageQueueingRequested.value = BigInt(ev.MessageQueueingRequested.value);
    if ('ReplyQueueingRequested' in ev) ev.ReplyQueueingRequested.value = BigInt(ev.ReplyQueueingRequested.value);
  }
}
