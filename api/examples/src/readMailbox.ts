import { GearApi, GearMailbox } from '@gear-js/api';
import { H256 } from '@polkadot/types/interfaces';

async function main() {
  const api = await GearApi.create();
  const mailbox = new GearMailbox(api);

  const read = await mailbox.readMailbox('0x8eaf04151687736326c9fea17e25fc5287613693c912909cb226aa4794f26a48');

  if (read.isSome) {
    read.unwrap().forEach(({ id, dest, source, payload, reply, value }, key: H256) => {
      console.log(key.toHex());
      console.log(`destination: ${dest.toHex()}\nsource: ${source.toHex()}`);
    });
  }
}

main();
