import { Button, Input } from '@gear-js/ui';
import { Box } from 'components';

type Props = {
  onSubmit: (value: string) => void;
};

function InputWalletForm({ onSubmit }: Props) {
  const handleSubmit = () => onSubmit('0x00');

  return (
    <Box>
      <form onSubmit={handleSubmit}>
        <Input label="Wallet address" />
        <Button type="submit" text="Continue" block />
      </form>
    </Box>
  );
}

export { InputWalletForm };
