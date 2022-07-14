import { GearApi } from '@gear-js/api';

let api: GearApi;

type GearSignedBlock = Awaited<ReturnType<typeof api.blocks.get>>;

export { GearSignedBlock };
