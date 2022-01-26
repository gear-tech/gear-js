import child_process from 'child_process';

const exec = async (cmd) => {
  let result = new Promise((resolve, reject) => {
    child_process.exec(`node src/app.js ${cmd}`, (error, stdout) => {
      if (error) {
        reject(error);
      }
      resolve(stdout);
    });
  });
  // console.log(await result);
  return await result;
};

describe('Test gear-meta', () => {
  test('--help', async () => {
    expect(await exec('--help')).toBeDefined();
  });

  test('--version', async () => {
    expect(await exec('--version')).toBeDefined();
  });

  test('decode PING', async () => {
    expect(await exec('decode 0x50494e47 -t String')).toBeDefined();
  });

  test('encode PING', async () => {
    expect(await exec('encode PING -t String')).toBeDefined();
  });

  test('encode init_input', async () => {
    expect(
      await exec(`encode '{"amount": 8, "currency": "GRT"}' -t init_input -m test/wasm/demo_meta.meta.wasm`),
    ).toBeDefined();
  });

  test('decode init_input', async () => {
    expect(await exec(`decode 0x080c475254 -t init_input -m test/wasm/demo_meta.meta.wasm`)).toBeDefined();
  });

  test('meta', async () => {
    expect(await exec('meta test/wasm/demo_meta.meta.wasm')).toBeDefined();
  });

  test('type', async () => {
    expect(await exec('type handle_input -m test/wasm/demo_meta.meta.wasm')).toBeDefined();
  });
});
