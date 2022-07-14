import { Button } from '@gear-js/ui';
import check from 'assets/images/icons/check.svg';
import reset from 'assets/images/icons/reset.svg';

type Props = {
  isBuyer: boolean;
  onConfirm: () => void;
  onRefund: () => void;
};

function Confirmation({ isBuyer, onConfirm, onRefund }: Props) {
  return isBuyer ? (
    <Button text="Confirm deal" icon={check} onClick={onConfirm} block />
  ) : (
    <Button text="Refund tokens" icon={reset} onClick={onRefund} block />
  );
}

export { Confirmation };
