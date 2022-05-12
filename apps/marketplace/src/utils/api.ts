import { GearApi, GearKeyring, Hex, Metadata } from '@gear-js/api';
import { web3FromSource } from '@polkadot/extension-dapp';
import { AnyJson, ISubmittableResult } from '@polkadot/types/types';
import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';

async function sendMessage(
  api: GearApi,
  account: InjectedAccountWithMeta,
  destination: Hex,
  payload: AnyJson,
  metadata: Metadata,
  handleStatus: (result: ISubmittableResult) => void,
  value = '0',
) {
  const { address, meta } = account;

  const decodedAddress = GearKeyring.decodeAddress(address);
  const gasLimit = await api.program.gasSpent.handle(decodedAddress, destination, payload, value, metadata);

  const message = { destination, payload, gasLimit, value };
  api.message.submit(message, metadata);

  const { source } = meta;
  const { signer } = await web3FromSource(source);
  api.message.signAndSend(address, { signer }, handleStatus);
}

export default sendMessage;
