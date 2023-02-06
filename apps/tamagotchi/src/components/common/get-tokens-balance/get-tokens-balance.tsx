import { TooltipWrapper, Button, buttonStyles } from '@gear-js/ui';
import clsx from 'clsx';
import { useGetFTBalance } from 'app/hooks/use-ft-balance';
import { Icon } from 'components/ui/icon';

export const GetTokensBalance = () => {
  const { handler } = useGetFTBalance();

  return (
    <div>
      <TooltipWrapper text="Get Tokens Balance">
        <Button
          className={clsx('p-2', buttonStyles.light)}
          icon={() => <Icon name="test-balance" width={20} height={20} />}
          onClick={() => handler()}
        />
      </TooltipWrapper>
    </div>
  );
};
