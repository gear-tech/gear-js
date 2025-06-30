import { Wallet } from 'ethers';

export async function uploadContract(contractByteCode: string | Uint8Array, wallet: Wallet) {
  if (!wallet.provider) {
    throw new Error('Wallet must be connected to a provider');
  }

  const tx = await wallet.sendTransaction({
    data:
      typeof contractByteCode === 'string'
        ? contractByteCode
        : '0x' + Array.from(contractByteCode, (byte) => byte.toString(16).padStart(2, '0')).join(''),
  });

  const receipt = await tx.wait();

  return receipt.contractAddress;
}
