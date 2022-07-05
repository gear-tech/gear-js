import { useState } from 'react';
import { ADDRESS } from 'consts';
import { CreateWalletFormData } from 'types';
import { useEscrowMessage, useWalletId } from 'hooks';
import { InitWalletForm } from './init-wallet-form';
import { InputWalletForm } from './input-wallet-form';
import { StartWalletForm } from './start-wallet-form';
import { Summary } from './summary';
import styles from './Home.module.scss';

function Home() {
  const programId = ADDRESS.ESCROW_CONTRACT;
  const sendMessage = useEscrowMessage();
  const { walletId, setWalletId } = useWalletId();

  const [status, setStatus] = useState('');

  const init = () => setStatus('initWallet');
  const use = () => setStatus('inputWallet');

  const createWallet = ({ values, onSuccess }: CreateWalletFormData) => sendMessage({ Create: values }, { onSuccess });

  const getWalletForm = () => {
    switch (status) {
      case 'initWallet':
        return <InitWalletForm onSubmit={createWallet} />;
      case 'inputWallet':
        return <InputWalletForm onSubmit={setWalletId} />;
      default:
        return <StartWalletForm onInit={init} onUse={use} />;
    }
  };

  return (
    <div className={styles.container}>
      <Summary programId={programId} walletId={walletId} />
      {walletId ? 'test' : getWalletForm()}
    </div>
  );
}

export { Home };
