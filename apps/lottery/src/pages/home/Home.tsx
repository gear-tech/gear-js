import { useAccount } from '@gear-js/react-hooks';
import { Loader, Pending, Start } from 'components';
import { useLottery } from 'hooks';

function Home() {
  const { account } = useAccount();

  const { lottery, isLotteryRead } = useLottery();
  const { lotteryOwner } = lottery || {};

  const isLotteryStarted = lottery?.lotteryStarted;
  const isOwner = account?.decodedAddress === lotteryOwner;

  return isLotteryRead ? (
    <>
      {!isLotteryStarted && <Start />}
      {isLotteryStarted && <Pending />}
    </>
  ) : (
    <Loader />
  );
}

export { Home };
