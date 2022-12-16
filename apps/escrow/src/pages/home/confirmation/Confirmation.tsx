import { Button } from '@gear-js/ui';
import { ReactComponent as check } from 'assets/images/icons/check.svg';
import { ReactComponent as reset } from 'assets/images/icons/reset.svg';
import { InfoText } from 'components';
import { ESCROW } from 'consts';

type Props = {
  role: string | undefined;
  onConfirm: () => void;
  onRefund: () => void;
};

function Confirmation({ role, onConfirm, onRefund }: Props) {
  const getComponent = () => {
    switch (role) {
      case ESCROW.ROLE.BUYER:
        return <Button text="Confirm deal" icon={check} onClick={onConfirm} block />;
      case ESCROW.ROLE.SELLER:
        return <Button text="Refund tokens" icon={reset} onClick={onRefund} block />;
      default:
        return <InfoText text="Awaiting deal confirmation." />;
    }
  };

  return getComponent();
}

export { Confirmation };
