import { useEffect, useMemo, useState } from 'react';
import { useAccount } from '@gear-js/react-hooks';

import { useStakingState } from 'hooks/useStakingState';
import { TIME } from 'consts';
import { convertToNumber, preparedStakerState } from 'utils';
import { ProgramState, InfoState, StakerState, Staker } from 'types/state';
import { Box } from 'components/common/box';
import { Loader } from 'components/loaders/loader';
import { Switcher } from 'components/common/switcher';
import { ReactComponent as CubeSVG } from 'assets/images/cube.svg';

import styles from './Home.module.scss';
import { SwitcerValue } from './types';
import { SWITCHER_ITEMS, PAYLOAD_FOR_INFO_STATE } from './consts';
import { StakersList } from './stakersList';
import { StakeForm } from './stakeForm';
import { StateForm } from './stateForm';
import { WithdrawForm } from './withdrawForm';
import { UpdateStakingForm } from './updateStakingForm';

function Home() {
  const { account } = useAccount();

  const [isLoading, setIsLoading] = useState(true);
  const [staker, setStaker] = useState<Staker | null>(null);
  const [activeValue, setActiveValue] = useState<string>(SwitcerValue.List);
  const [distributionTime, setDistributionTime] = useState(0);

  const decodeAddress = account?.decodedAddress;

  const payloadForStakerState = useMemo(() => ({ [ProgramState.GetStaker]: decodeAddress }), [decodeAddress]);

  const { state: infoState } = useStakingState<InfoState>(PAYLOAD_FOR_INFO_STATE);
  const { state: stakerState } = useStakingState<StakerState>(payloadForStakerState);

  const isOwner = infoState?.Info.admin === decodeAddress;

  const switcherItems = useMemo(() => (isOwner ? SWITCHER_ITEMS : SWITCHER_ITEMS.slice(1)), [isOwner]);

  const updateStakerBalance = (balance: number) =>
    setStaker((prevState) =>
      prevState
        ? {
            ...prevState,
            balance,
          }
        : null,
    );

  const reduceDistributionTime = () =>
    setDistributionTime((prevState) => {
      const difference = prevState - TIME.MINUTE;

      return difference > 0 ? difference : 0;
    });

  const getContent = () => {
    switch (activeValue) {
      case SwitcerValue.Stake:
        return <StakeForm balance={staker!.balance} updateStakerBalance={updateStakerBalance} />;
      case SwitcerValue.State:
        return <StateForm staker={staker!} />;
      case SwitcerValue.List:
        return <StakersList distributionTime={distributionTime} />;
      case SwitcerValue.Update:
        return <UpdateStakingForm />;
      case SwitcerValue.Withdraw:
        return <WithdrawForm balance={staker!.balance} updateStakerBalance={updateStakerBalance} />;
      default:
        return null;
    }
  };

  useEffect(() => {
    if (infoState && stakerState) {
      const time = convertToNumber(infoState.Info.timeLeft);
      const preparedInfo = preparedStakerState(stakerState.Staker);

      setIsLoading(false);
      setStaker(preparedInfo);
      setDistributionTime(time);
    }
  }, [infoState, stakerState]);

  useEffect(() => {
    if (!distributionTime) {
      return;
    }

    const timer = setTimeout(reduceDistributionTime, TIME.MINUTE);

    return () => {
      clearTimeout(timer);
    };
  }, [distributionTime]);

  useEffect(
    () => () => {
      setIsLoading(true);
      setActiveValue(SwitcerValue.List);
    },
    [decodeAddress],
  );

  return (
    <>
      <h1 className={styles.heading}>Stacking</h1>
      {isLoading ? (
        <Loader />
      ) : (
        <div className={styles.content}>
          <div className={styles.cubeWrapper}>
            <CubeSVG />
          </div>
          <div className={styles.main}>
            <Switcher value={activeValue} items={switcherItems} onChange={setActiveValue} />
            <Box>{getContent()}</Box>
          </div>
        </div>
      )}
    </>
  );
}

export { Home };
