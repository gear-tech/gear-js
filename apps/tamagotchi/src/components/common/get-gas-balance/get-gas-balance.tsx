import { TooltipWrapper, Button, buttonStyles } from '@gear-js/ui';
import { Icon } from 'components/ui/icon';
import clsx from 'clsx';

export const GetGasBalance = () => {
  return (
    <div className="">
      <TooltipWrapper text="Get Gas Balance">
        <Button
          className={clsx('p-2', buttonStyles.lightGreen)}
          icon={() => <Icon name="test-balance" width={20} height={20} />}
        />
      </TooltipWrapper>
    </div>
  );
};
