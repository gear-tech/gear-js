import { DynamicSigner, walletClientToSigner } from '@vara-eth/api/signer';
import { useEffect, useMemo, useRef } from 'react';
import { useWalletClient } from 'wagmi';

function useSigner() {
  const { data: walletClient } = useWalletClient();
  const walletClientRef = useRef(walletClient);

  useEffect(() => {
    walletClientRef.current = walletClient;
  }, [walletClient]);

  return useMemo(() => {
    const getSigner = () => (walletClientRef.current ? walletClientToSigner(walletClientRef.current) : undefined);

    return new DynamicSigner(getSigner);
  }, []);
}

export { useSigner };
