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
      <TooltipWrapper text="Get Tokens">
        <Button
          className={clsx('group !p-2.5', buttonStyles.light)}
          icon={() => (
            <>
              <Icon name="test-balance" width={20} height={20} />
              <Icon
                name="plus"
                width={12}
                height={12}
                className="absolute bottom-2 right-1.5 bg-[#3a3a3a] group-hover:bg-[#6c6c6c] rounded-full transition-colors"
              />
            </>
          )}
          onClick={() => handler()}
          disabled={isPending}
        />
      </TooltipWrapper>
    </div>
  );
};
