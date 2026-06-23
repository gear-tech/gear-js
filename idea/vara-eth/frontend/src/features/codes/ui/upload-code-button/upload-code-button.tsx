import { useAtomValue } from 'jotai';
import { useRef, useState } from 'react';
import { useConnection } from 'wagmi';

import { useWrappedVaraBalance } from '@/app/api';
import { nodeAtom } from '@/app/store';
import { Button, Modal } from '@/components';
import { useUploadCode, useUploadCodeFee } from '@/features/codes/lib';
import { initKzgInWorker } from '@/features/codes/lib/kzg-worker-client';
import { ETH_CHAIN_ID_MAINNET } from '@/shared/config';
import { formatBalance } from '@/shared/utils';

import styles from './upload-code-button.module.scss';

export const UploadCodeButton = () => {
  const uploadCode = useUploadCode();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const { address } = useConnection();
  const { ethChainId } = useAtomValue(nodeAtom);
  const close = () => setIsOpen(false);

  const openModal = () => {
    setIsOpen(true);
    initKzgInWorker()
      .then(() => console.log('KZG worker initialized'))
      .catch((error) => console.error('KZG worker initialization failed:', error));
  };

  const { data: feeData, isPending: isFeePending } = useUploadCodeFee();
  const { value: balance, decimals: balanceDecimals, isPending: isBalancePending } = useWrappedVaraBalance();

  const fee = feeData?.fee;
  const feeDecimals = feeData?.decimals;

  const hasInsufficientBalance =
    !isFeePending && !isBalancePending && fee !== undefined && balance !== undefined && balance < fee;

  const formattedFee = fee !== undefined && feeDecimals !== undefined ? formatBalance(fee, feeDecimals) : null;

  const formattedBalance =
    balance !== undefined && balanceDecimals !== undefined ? formatBalance(balance, balanceDecimals) : null;
  const wvaraSourceLink =
    ethChainId === ETH_CHAIN_ID_MAINNET ? 'https://bridge.vara.network/' : 'https://eth.vara.network/faucet';
  const wvaraSourceLabel = ethChainId === ETH_CHAIN_ID_MAINNET ? 'Vara Bridge' : 'Vara.eth Faucet';

  if (!address) return null;

  const onSelectFile = () => {
    inputRef.current?.click();
  };

  const handleFileUpload: React.ChangeEventHandler<HTMLInputElement> = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (hasInsufficientBalance) return;

    try {
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      uploadCode.mutate(uint8Array, { onError: close, onSuccess: close });
    } catch (error) {
      console.error('Error reading file:', error);
    }
  };

  return (
    <>
      <Button size="xs" onClick={openModal}>
        Upload code
      </Button>

      {isOpen && (
        <Modal
          heading="Upload Code"
          close={close}
          action={
            <Button
              size="xs"
              onClick={onSelectFile}
              isLoading={uploadCode.isPending}
              disabled={hasInsufficientBalance || isFeePending || isBalancePending}>
              Select File
            </Button>
          }>
          <div className={styles.feeInfo}>
            <span>Validation fee:</span>
            <span>{formattedFee !== null ? `${formattedFee} WVARA` : '...'}</span>
          </div>

          {hasInsufficientBalance && (
            <p className={styles.insufficientBalance}>
              Insufficient WVARA balance. <br /> Your balance: {formattedBalance} WVARA.
              <br />
              You can get WVARA via the{' '}
              <a href={wvaraSourceLink} target="_blank" rel="noreferrer">
                {wvaraSourceLabel}
              </a>
              .
            </p>
          )}

          <input
            ref={inputRef}
            type="file"
            id="fileInput"
            onChange={handleFileUpload}
            className={styles.input}
            accept="application/wasm"
          />
        </Modal>
      )}
    </>
  );
};
