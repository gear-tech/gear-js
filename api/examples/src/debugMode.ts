import { DebugMode, GearApi, GearKeyring } from '@gear-js/api';

async function main() {
  const api = await GearApi.create();
  console.log(`Connected to ${await api.chain()}`);
  const rootKeys = GearKeyring.fromSuri('//Alice', 'Alice default');
  const debugMode = new DebugMode(api);

  debugMode.enable();
  const isEnabled = await debugMode.signAndSend(rootKeys);
  console.log(isEnabled);

  const unsub = await debugMode.snapshots(({ data }) => {
    data.programs.forEach(({ id, static_pages, persistent_pages, code_hash, nonce }) => {
      console.log(`Program with id: ${id.toHuman()}`);
    });
    data.messageQueue.forEach(({ id, source, dest, payload, gas_limit, value, reply }) => {
      console.log(`Message with id: ${id.toHuman()}`);
    });
  });
}

main();
