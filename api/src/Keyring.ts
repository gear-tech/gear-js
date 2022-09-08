import { mnemonicGenerate, mnemonicToMiniSecret, signatureVerify } from '@polkadot/util-crypto';
import { hexToU8a, isU8a, stringToU8a, isString, u8aToHex } from '@polkadot/util';
import { KeyringPair, KeyringPair$Json } from '@polkadot/keyring/types';
import { Keypair } from '@polkadot/util-crypto/types';
import { waitReady } from '@polkadot/wasm-crypto';
import { Keyring } from '@polkadot/api';

import { Hex } from './types';
import { decodeAddress } from './utils';

export class GearKeyring {
	private static unlock(keyring: KeyringPair, passphrase?: string) {
		if (keyring.isLocked) {
			keyring.unlock(passphrase);
		}
		return keyring;
	}

	static async fromSuri(suri: string, name?: string): Promise<KeyringPair> {
		const keyring = new Keyring({ type: 'sr25519' });
		await waitReady();
		const keyPair = keyring.addFromUri(suri, { name });
		return keyPair;
	}

	static fromKeyPair(pair: Keypair, name?: string): KeyringPair {
		const keyring = new Keyring({ type: 'sr25519' });
		return GearKeyring.unlock(keyring.addFromPair(pair, { name }));
	}

	static fromJson(keypairJson: KeyringPair$Json | string, passphrase?: string): KeyringPair {
		const json: KeyringPair$Json = isString(keypairJson) ? JSON.parse(keypairJson) : keypairJson;
		const keyring = new Keyring().addFromJson(json);
		return GearKeyring.unlock(keyring, passphrase);
	}

	static async fromSeed(seed: Uint8Array | string, name?: string): Promise<KeyringPair> {
		const keyring = new Keyring({ type: 'sr25519' });
		await waitReady();

		const keypair = isU8a(seed) ? keyring.addFromSeed(seed, { name }) : keyring.addFromSeed(hexToU8a(seed), { name });
		return keypair;
	}

	static async fromMnemonic(mnemonic: string, name?: string): Promise<KeyringPair> {
		return await GearKeyring.fromSuri(mnemonic, name);
	}

	static toJson(keyring: KeyringPair, passphrase?: string): KeyringPair$Json {
		return keyring.toJson(passphrase);
	}

	static async create(
		name: string,
		passphrase?: string,
	): Promise<{
		keyring: KeyringPair;
		mnemonic: string;
		seed: string;
		json: KeyringPair$Json;
	}> {
		const mnemonic = mnemonicGenerate();
		const seed = mnemonicToMiniSecret(mnemonic);
		const keyring = await GearKeyring.fromSeed(seed, name);
		return {
			keyring,
			mnemonic: mnemonic,
			seed: u8aToHex(seed),
			json: keyring.toJson(passphrase),
		};
	}

	static generateMnemonic(): string {
		return mnemonicGenerate();
	}

	static generateSeed(mnemonic?: string): { seed: `0x${string}`; mnemonic: string } {
		if (!mnemonic) {
			mnemonic = mnemonicGenerate();
		}
		return { seed: u8aToHex(mnemonicToMiniSecret(mnemonic)), mnemonic };
	}

	static sign(keyring: KeyringPair, message: string) {
		return keyring.sign(stringToU8a(message));
	}

	static checkPublicKey(publicKey: string): boolean {
		try {
			decodeAddress(publicKey);
		} catch (error) {
			return false;
		}
		return true;
	}
}
