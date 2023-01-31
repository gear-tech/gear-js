import { TooltipWrapper, Button, buttonStyles } from '@gear-js/ui';
import { Icon } from 'components/ui/icon';
import clsx from 'clsx';
import metaCode from 'assets/meta/meta-ft-code.txt';
import { useLesson } from 'app/context';
import { useMetadata } from 'app/hooks/use-metadata';
import { useFtMessage } from 'app/hooks/use-ft-message';

export const GetTokensBalance = () => {
  const { lesson } = useLesson();
  const sendHandler = useFtMessage();
  const { metadata } = useMetadata(metaCode);

  const handle = () => {
    const encodedMint = metadata
      ?.createType(9, {
        Mint: {
          amount: 10000,
          recipient: lesson?.programId,
        },
      })
      .toU8a();

    const onSuccess = () => console.log('success');

    if (encodedMint) {
      sendHandler(
        { Message: { transaction_id: Math.floor(Math.random() * Date.now()), payload: [...encodedMint] } },
        { onSuccess },
      );
    }
  };

  return (
    <div>
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
