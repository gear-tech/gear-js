import { Button } from '@gear-js/ui';
import { Box } from 'components';

type Props = {
  onInit: () => void;
  onUse: () => void;
};

function StartWalletForm({ onInit, onUse }: Props) {
  return (
    <Box>
      <Button text="Create wallet" onClick={onInit} block />
      <Button text="Use existing one" color="secondary" onClick={onUse} block />
    </Box>
  );
}

export { StartWalletForm };
