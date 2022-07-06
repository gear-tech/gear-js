import { Button } from '@gear-js/ui';

type Props = {
  onInit: () => void;
  onUse: () => void;
};

function StartWalletForm({ onInit, onUse }: Props) {
  return (
    <>
      <Button text="Create wallet" onClick={onInit} block />
      <Button text="Use existing one" color="secondary" onClick={onUse} block />
    </>
  );
}

export { StartWalletForm };
