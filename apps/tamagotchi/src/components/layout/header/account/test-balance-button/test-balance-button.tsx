import { TooltipWrapper, Button, buttonStyles } from '@gear-js/ui';
import { Icon } from '../../../../ui/icon';
import clsx from 'clsx';


export const TestBalanceButton = () => {
  return (
    <div className=''>
      <TooltipWrapper text='Get test balance'>
        <Button
          className={clsx('p-2', buttonStyles.lightGreen)}
          icon={() => <Icon name="test-balance" width={20} height={20} />}
        />
      </TooltipWrapper>
    </div>
  );
};
