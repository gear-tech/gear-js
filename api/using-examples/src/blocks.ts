import { GearApi } from '@gear-js/api';

const blocks = async () => {
  const api = await GearApi.create();
  const block = await api.blocks.get('0x1396ba425f7c9650d784c67bcfe67159d1fe90b13d008f79abdb0437c49bc474');
  console.log(block.block.toHuman());
  const events = await api.blocks.getEvents('0x1396ba425f7c9650d784c67bcfe67159d1fe90b13d008f79abdb0437c49bc474');
  events.forEach((event) => {
    console.log(event.toHuman());
  });
};

blocks();
