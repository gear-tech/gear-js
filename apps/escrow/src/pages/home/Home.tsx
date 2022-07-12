import { useAccount } from '@gear-js/react-hooks';
import { useEffect, useState } from 'react';
import { ESCROW, FORM, LOCAL_STORAGE } from 'consts';
import { CreateFormValues } from 'types';
import { useEscrow, useEscrowMessage, useWalletId, useProgram, useWallets } from 'hooks';
import { Box, Loader } from 'components';
import { CreateWallet } from './create-wallet';
import { Summary } from './summary';
import { Start } from './start';
import { Deposit } from './deposit';
import { Confirmation } from './confirmation';
import { Closed } from './closed';
import { InputAddress } from './input-address';
import { SelectWallet } from './select-wallet';
import styles from './Home.module.scss';

function Home() {
  const { account } = useAccount();

  const [form, setForm] = useState('');
  const resetForm = () => setForm('');

  const { programId, setProgramId, resetProgramId, uploadProgram } = useProgram();
  const { walletId, setWalletId, resetWalletId } = useWalletId();

  const { escrow, isEscrowRead } = useEscrow(walletId);
  const { wallets, isWalletsStateRead } = useWallets();
  const sendMessage = useEscrowMessage();

  const { buyer, seller, state, amount } = escrow || {};
  const isBuyer = !!account && account.decodedAddress === buyer;
  const isSeller = !!account && account.decodedAddress === seller;
  const isStart = !form && !programId && !walletId;

  const create = (values: CreateFormValues) => sendMessage({ Create: values });
  const deposit = () => sendMessage({ Deposit: walletId });
  const cancel = () => sendMessage({ Cancel: walletId });
  const confirm = () => sendMessage({ Confirm: walletId });
  const refund = () => sendMessage({ Refund: walletId });

  const goBack = () => {
    if (form) resetForm();
    else if (walletId) resetWalletId(); // order is important
    else if (programId) resetProgramId();
  };

  const goHome = () => {
    resetForm();
    resetProgramId();
    resetWalletId();
  };

  const openInitProgramForm = () => setForm(FORM.INIT.PROGRAM);
  const openInputProgramForm = () => setForm(FORM.INPUT.PROGRAM);
  const openInitWalletForm = () => setForm(FORM.INIT.WALLET);
  const openInputWalletForm = () => setForm(FORM.INPUT.WALLET);

  const getRole = () => {
    if (isBuyer) return ESCROW.ROLE.BUYER;
    if (isSeller) return ESCROW.ROLE.SELLER;
  };

  const getForm = () => {
    switch (form) {
      case FORM.INIT.PROGRAM:
        return <InputAddress label="Fungible token address" onSubmit={uploadProgram} />;
      case FORM.INPUT.PROGRAM:
        return <InputAddress label="Program address" onSubmit={setProgramId} />;
      case FORM.INIT.WALLET:
        return <CreateWallet onSubmit={create} />;
      case FORM.INPUT.WALLET:
        return <SelectWallet wallets={wallets} onSubmit={setWalletId} />;
      default:
    }
  };

  const getButtons = () => {
    switch (state) {
      case ESCROW.STATE.AWAITING_DEPOSIT:
        return <Deposit isBuyer={isBuyer} onDeposit={deposit} onCancel={cancel} />;
      case ESCROW.STATE.AWAITING_CONFIRMATION:
        return <Confirmation isBuyer={isBuyer} onConfirm={confirm} onRefund={refund} />;
      case ESCROW.STATE.CLOSED:
        return <Closed />;
      default:
    }
  };

  useEffect(() => localStorage.setItem(LOCAL_STORAGE.PROGRAM, programId), [programId]);
  useEffect(() => localStorage.setItem(LOCAL_STORAGE.WALLET, walletId), [walletId]);
  useEffect(() => resetForm(), [programId, walletId]);

  return isEscrowRead && isWalletsStateRead ? (
    <div className={styles.container}>
      <Summary programId={programId} walletId={walletId} role={getRole()} state={state} amount={amount} />
      <Box onBack={goBack} onHome={goHome} isNavigationVisible={!isStart}>
        {form && getForm()}
        {!form &&
          (programId ? (
            <>
              {walletId && getButtons()}
              {!walletId && <Start text="Create wallet" onInit={openInitWalletForm} onUse={openInputWalletForm} />}
            </>
          ) : (
            <Start text="Initialize program" onInit={openInitProgramForm} onUse={openInputProgramForm} />
          ))}
      </Box>
    </div>
  ) : (
    <Loader />
  );
}

export { Home };
