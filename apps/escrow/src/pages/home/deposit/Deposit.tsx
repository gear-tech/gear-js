import { Button } from '@gear-js/ui';
import wallet from 'assets/images/icons/wallet.svg';
import cross from 'assets/images/icons/cross.svg';

type Props = {
  isBuyer: boolean;
  onDeposit: () => void;
  onCancel: () => void;
};

function Deposit({ isBuyer, onDeposit, onCancel }: Props) {
  return isBuyer ? (
    <>
      <Button text="Make deposit" icon={wallet} onClick={onDeposit} block />
      <Button text="Cancel deal" icon={cross} color="secondary" onClick={onCancel} block />
    </>
  ) : (
    <Button text="Cancel deal" icon={cross} color="secondary" onClick={onCancel} block />
  );
}

export { Deposit };
