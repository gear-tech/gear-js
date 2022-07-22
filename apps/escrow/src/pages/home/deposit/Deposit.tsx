import { Button } from '@gear-js/ui';
import wallet from 'assets/images/icons/wallet.svg';
import cross from 'assets/images/icons/cross.svg';
import { ESCROW } from 'consts';
import { InfoText } from 'components';

type Props = {
  role: string | undefined;
  onDeposit: () => void;
  onCancel: () => void;
};

function Deposit({ role, onDeposit, onCancel }: Props) {
  const getComponent = () => {
    switch (role) {
      case ESCROW.ROLE.BUYER:
        return (
          <>
            <Button text="Make deposit" icon={wallet} onClick={onDeposit} block />
            <Button text="Cancel deal" icon={cross} color="secondary" onClick={onCancel} block />
          </>
        );
      case ESCROW.ROLE.SELLER:
        return <Button text="Cancel deal" icon={cross} color="secondary" onClick={onCancel} block />;
      default:
        return <InfoText text="Awaiting buyer deposit." />;
    }
  };

  return getComponent();
}

export { Deposit };
