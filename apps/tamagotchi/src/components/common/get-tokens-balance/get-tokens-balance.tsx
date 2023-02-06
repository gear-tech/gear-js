import { TooltipWrapper, Button, buttonStyles } from '@gear-js/ui';
import clsx from 'clsx';
import { useGetFTBalance } from 'app/hooks/use-ft-balance';
import { Icon } from 'components/ui/icon';
import { useApp } from 'app/context';

export const GetTokensBalance = () => {
  const { handler } = useGetFTBalance();
  const { isPending } = useApp();

  return (
    <div>
      <TooltipWrapper text="Get Tokens Balance">
        <Button
          className={clsx('p-2', buttonStyles.light)}
          icon={() => <Icon name="test-balance" width={20} height={20} />}
          onClick={() => handler()}
          disabled={isPending}
        />
      </TooltipWrapper>
    </div>
  );
};
