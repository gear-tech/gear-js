import { Button } from '@gear-js/ui';

type Props = {
  isBuyer: boolean;
  onDeposit: () => void;
  onCancel: () => void;
};

function Deposit({ isBuyer, onDeposit, onCancel }: Props) {
  return isBuyer ? (
    <>
      <Button text="Make deposit" onClick={onDeposit} block />
      <Button text="Cancel deal" color="secondary" onClick={onCancel} block />
    </>
  ) : (
    <Button text="Cancel deal" color="secondary" onClick={onCancel} block />
  );
}

export { Deposit };
