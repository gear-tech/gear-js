import { Wallet } from 'ethers';
import { isAddress } from 'viem';
import { EthersAdapter } from '../../../src/signer/adapters/ethers.adapter.js';
import {
  TEST_PRIVATE_KEY,
  TEST_ADDRESS,
  TEST_MESSAGES,
  createTestEthersWallet,
  verifySignature,
} from '../test-fixtures.js';

describe('EthersAdapter', () => {
  describe('Constructor', () => {
    it('should create adapter from Ethers wallet', () => {
      const wallet = createTestEthersWallet();
      const adapter = new EthersAdapter(wallet);

      expect(adapter).toBeInstanceOf(EthersAdapter);
    });

    it('should create adapter using static from method', () => {
      const wallet = createTestEthersWallet();
      const adapter = EthersAdapter.from(wallet);

      expect(adapter).toBeInstanceOf(EthersAdapter);
    });
  });

  describe('signMessage', () => {
    let wallet: Wallet;
    let adapter: EthersAdapter;

    beforeEach(() => {
      wallet = createTestEthersWallet();
      adapter = new EthersAdapter(wallet);
    });

    it('should sign a hex string message', async () => {
      const signature = await adapter.signMessage(TEST_MESSAGES.hex);

      expect(typeof signature).toBe('string');
      expect(signature.startsWith('0x')).toBe(true);
      expect(signature).toHaveLength(132);
      expect(verifySignature(signature, TEST_MESSAGES.hex)).toBe(true);
    });

    it('should sign a Uint8Array message', async () => {
      const signature = await adapter.signMessage(TEST_MESSAGES.bytes);

      expect(verifySignature(signature, TEST_MESSAGES.bytes)).toBe(true);
    });

    it('should return consistent signatures for same message', async () => {
      const sig1 = await adapter.signMessage(TEST_MESSAGES.hex);
      const sig2 = await adapter.signMessage(TEST_MESSAGES.hex);

      expect(sig1).toBe(sig2);
    });

    it('should normalize signature to have 0x prefix', async () => {
      const signature = await adapter.signMessage(TEST_MESSAGES.hex);

      expect(signature.startsWith('0x')).toBe(true);
    });
  });

  describe('getAddress', () => {
    let wallet: Wallet;
    let adapter: EthersAdapter;

    beforeEach(() => {
      wallet = createTestEthersWallet();
      adapter = new EthersAdapter(wallet);
    });

    it('should retrieve the correct address', async () => {
      const address = await adapter.getAddress();

      expect(typeof address).toBe('string');
      expect(address.startsWith('0x')).toBe(true);
      expect(isAddress(address)).toBe(true);
      expect(address).toBe(TEST_ADDRESS);
    });

    it('should return consistent address on multiple calls', async () => {
      const addr1 = await adapter.getAddress();
      const addr2 = await adapter.getAddress();

      expect(addr1).toBe(addr2);
    });
  });

  describe('Real Ethers.js Integration', () => {
    it('should work with Ethers.js Wallet', async () => {
      const wallet = new Wallet(TEST_PRIVATE_KEY);
      const adapter = new EthersAdapter(wallet);

      const signature = await adapter.signMessage(TEST_MESSAGES.hex);
      const address = await adapter.getAddress();

      expect(verifySignature(signature, TEST_MESSAGES.hex)).toBe(true);
      expect(address).toBe(TEST_ADDRESS);
    });

    it('should produce verifiable signatures', async () => {
      const wallet = new Wallet(TEST_PRIVATE_KEY);
      const adapter = new EthersAdapter(wallet);

      const message = 'Test message for verification';
      const signature = await adapter.signMessage(message);

      expect(verifySignature(signature, message, TEST_ADDRESS)).toBe(true);
    });

    it('should handle both hex and bytes messages', async () => {
      const wallet = createTestEthersWallet();
      const adapter = new EthersAdapter(wallet);

      const hexSig = await adapter.signMessage(TEST_MESSAGES.hex);
      const bytesSig = await adapter.signMessage(TEST_MESSAGES.bytes);

      expect(verifySignature(hexSig, TEST_MESSAGES.hex, TEST_ADDRESS)).toBe(true);
      expect(verifySignature(bytesSig, TEST_MESSAGES.bytes, TEST_ADDRESS)).toBe(true);
    });
  });

  describe('Performance', () => {
    it('should handle multiple parallel signing operations', async () => {
      const wallet = createTestEthersWallet();
      const adapter = new EthersAdapter(wallet);

      const messages = Array.from({ length: 10 }, (_, i) => `0x${i.toString(16).repeat(20)}`);
      const promises = messages.map((msg) => adapter.signMessage(msg));

      const signatures = await Promise.all(promises);

      expect(signatures).toHaveLength(10);
      signatures.forEach((sig, i) => {
        expect(verifySignature(sig, messages[i])).toBe(true);
      });
    });

    it('should handle rapid sequential signing', async () => {
      const wallet = createTestEthersWallet();
      const adapter = new EthersAdapter(wallet);

      const messages: string[] = [];
      const signatures: string[] = [];
      for (let i = 0; i < 5; i++) {
        const msg = `0x${i.toString(16).repeat(10)}`;
        messages.push(msg);
        const sig = await adapter.signMessage(msg);
        signatures.push(sig);
      }

      expect(signatures).toHaveLength(5);
      signatures.forEach((sig, i) => {
        expect(verifySignature(sig, messages[i])).toBe(true);
      });
    });
  });
});
