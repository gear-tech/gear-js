import { TooltipWrapper, Button, buttonStyles } from '@gear-js/ui';
import { Icon } from 'components/ui/icon';
import clsx from 'clsx';
import { CreateType, Hex } from '@gear-js/api';
import { useAccount } from '@gear-js/react-hooks';
import meta from 'assets/meta/meta-ft.txt';

export const GetTokensBalance = () => {
  const { account } = useAccount();
  const handle = () => {
    const result = CreateType.create(
      'TokenContractMessage',
      {
        Mint: { recipient: account?.decodedAddress, amount: 2000 },
      },
      meta as Hex,
    );

    console.log(result.toJSON());
  };

  return (
    <div className="">
      <TooltipWrapper text="Get Tokens Balance">
        <Button
          className={clsx('p-2', buttonStyles.light)}
          icon={() => <Icon name="test-balance" width={20} height={20} />}
          onClick={handle}
        />
      </TooltipWrapper>
    </div>
  );
};
