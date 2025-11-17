import { Wallet, verifyMessage } from 'ethers';
import { privateKeyToAccount } from 'viem/accounts';

export const TEST_PRIVATE_KEY = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';

export const TEST_ADDRESS = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';

export const TEST_MESSAGES = {
  hex: '0x48656c6c6f20576f726c64',
  bytes: new Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100]),
};

export function createTestEthersWallet(): Wallet {
  return new Wallet(TEST_PRIVATE_KEY);
}

export function createTestViemAccount() {
  return privateKeyToAccount(TEST_PRIVATE_KEY);
}

export function verifySignature(
  signature: string,
  message: string | Uint8Array,
  expectedAddress: string = TEST_ADDRESS,
): boolean {
  try {
    const recoveredAddress = verifyMessage(message, signature);
    return recoveredAddress === expectedAddress;
  } catch {
    return false;
  }
}
