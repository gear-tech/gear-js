import { privateKeyToAccount } from 'viem/accounts';
import { InjectedTransaction } from '../src/types';
import { execSync } from 'node:child_process';

describe('Injected Transactions', () => {
  describe('Signature', () => {
    let injectedTxHash: string;
    let injectedTxSignature: string;
    const INJECTED_TEST_PROGRAM_MANIFEST_PATH = 'programs/injected/Cargo.toml';

    const TX: InjectedTransaction = new InjectedTransaction({
      recipient: '0x0000000000000000000000000000000000000000',
      destination: '0x0000000000000000000000000000000000000000',
      payload: '0x000102',
      value: 256n,
      referenceBlock: '0x0000000000000000000000000000000000000000000000000000000000000000',
      salt: '0x030405',
    });

    const PRIVATE_KEY = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';

    beforeAll(() => {
      const result = execSync(`cargo run --manifest-path ${INJECTED_TEST_PROGRAM_MANIFEST_PATH}`, {
        stdio: 'pipe',
      });

      const resultStr = result.toString();

      const hash = resultStr.match('hash: <(0x[0-9a-f]{64})>')?.[1];
      if (!hash) {
        throw new Error('Hash not found in `signature` stdout');
      }
      const signature = resultStr.match('signature: <(0x[0-9a-f]*)>')?.[1];
      if (!signature) {
        throw new Error('Signature not found in `signature` stdout');
      }
      injectedTxHash = hash;
      injectedTxSignature = signature;
    }, 5 * 60_000);

    test('should create a correct hash', () => {
      expect(TX.hash).toBe(injectedTxHash);
    });

    test('should create a correct signature', async () => {
      const account = privateKeyToAccount(PRIVATE_KEY);

      const signature = await account.sign({ hash: TX.hash });

      expect(signature).toBe(injectedTxSignature);
    });
  });

  test.todo('send injected transactions');
});
