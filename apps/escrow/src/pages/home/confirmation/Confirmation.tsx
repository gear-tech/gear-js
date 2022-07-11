import { Button } from '@gear-js/ui';

type Props = {
  isBuyer: boolean;
  onConfirm: () => void;
  onRefund: () => void;
};

function Confirmation({ isBuyer, onConfirm, onRefund }: Props) {
  return isBuyer ? (
    <Button text="Confirm deal" onClick={onConfirm} block />
  ) : (
    <Button text="Refund tokens" onClick={onRefund} block />
  );
}

export { Confirmation };
