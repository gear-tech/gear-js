import { GearApi, Hex } from '../src';
import { sleep } from './utilsFunctions';

const api = new GearApi();
let someProgramId: Hex;

beforeAll(async () => {
  await api.isReady;
});

afterAll(async () => {
  await api.disconnect();
  await sleep(1000);
});

describe('Program', () => {
  test('Get all uploaded programs', async () => {
    const programs = await api.program.allUploadedPrograms();
    someProgramId = programs[0];
    expect(programs).toBeDefined();
  });

  test('Program is exist', async () => {
    const programs = await api.program.is(someProgramId);
    expect(programs).toBeTruthy();
  });
});
