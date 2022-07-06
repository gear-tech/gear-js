import { useAccount } from '@gear-js/react-hooks';
import { Button } from '@gear-js/ui';
import { useState } from 'react';
import { ADDRESS } from 'consts';
import { CreateFormValues } from 'types';
import { useEscrow, useEscrowMessage, useWalletId } from 'hooks';
import { Box, Loader } from 'components';
import { InitWalletForm } from './init-wallet-form';
import { InputWalletForm } from './input-wallet-form';
import { StartWalletForm } from './start-wallet-form';
import { Summary } from './summary';
import styles from './Home.module.scss';

function Home() {
  const { account } = useAccount();

  const programId = ADDRESS.ESCROW_CONTRACT;
  const [status, setStatus] = useState('');

  const sendMessage = useEscrowMessage();
  const { walletId, setWalletId } = useWalletId();
  const { escrow, isEscrowRead } = useEscrow(walletId);

  const { buyer, seller, state, amount } = escrow || {};
  const isBuyer = account?.decodedAddress === buyer;
  const isSeller = account?.decodedAddress === seller;

  const init = () => setStatus('initWallet');
  const use = () => setStatus('inputWallet');

  const create = (values: CreateFormValues) => sendMessage({ Create: values });
  const deposit = () => sendMessage({ Deposit: walletId });
  const cancel = () => sendMessage({ Cancel: walletId });
  const confirm = () => sendMessage({ Confirm: walletId });
  const refund = () => sendMessage({ Refund: walletId });

  const getWalletForm = () => {
    switch (status) {
      case 'initWallet':
        return <InitWalletForm onSubmit={create} />;
      case 'inputWallet':
        return <InputWalletForm onSubmit={setWalletId} />;
      default:
        return <StartWalletForm onInit={init} onUse={use} />;
    }
  };

  const getRole = () => {
    if (isBuyer) return 'Buyer';
    if (isSeller) return 'Seller';
  };

  const getComponents = () => {
    switch (state) {
      case 'AwaitingConfirmation':
        return isBuyer ? (
          <Button text="Confirm deal" onClick={confirm} />
        ) : (
          <Button text="Refund tokens" onClick={refund} />
        );
      case 'Closed':
        return <p>Wallet is closed, please go back and select or create another one.</p>;
      default:
        return isBuyer ? (
          <>
            <Button text="Make deposit" onClick={deposit} block />
            <Button text="Cancel deal" color="secondary" onClick={cancel} block />
          </>
        ) : (
          <Button text="Cancel deal" color="secondary" onClick={cancel} block />
        );
    }
  };

  return isEscrowRead ? (
    <div className={styles.container}>
      <Summary programId={programId} walletId={walletId} role={getRole()} state={state} amount={amount} />
      <Box>{walletId ? getComponents() : getWalletForm()}</Box>
    </div>
  ) : (
    <Loader />
  );
}

export { Home };
