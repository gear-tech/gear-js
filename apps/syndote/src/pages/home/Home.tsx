import { useEffect, useState } from 'react';
import { useAccount, useAlert, useApi, useMetadata } from '@gear-js/react-hooks';
import { CreateType, Hex, MessagesDispatched } from '@gear-js/api';
import { ADDRESS, fields, INIT_PLAYERS, LocalStorage } from 'consts';
import { MessagePayload, State, Step } from 'types';
import metaWasm from 'assets/wasm/syndote.meta.wasm';
import { UnsubscribePromise } from '@polkadot/api/types';
import { Loader } from 'components';
import { u8, Vec } from '@polkadot/types';
import { useSendMessage } from 'hooks';
import { Roll } from './roll';
import { Connect } from './connect';
import { Address } from './address';
import styles from './Home.module.scss';
import { Players } from './players/Players';
import { Button } from './button';
import { Buttons } from './buttons';
import { Cell } from './cell';

function Home() {
  const { account, logout } = useAccount();

  const [programId, setProgramId] = useState((localStorage[LocalStorage.Player] ?? '') as Hex);
  const resetProgramId = () => setProgramId('' as Hex);

  useEffect(() => {
    localStorage.setItem(LocalStorage.Player, programId);
  }, [programId]);

  const alert = useAlert();
  const { api } = useApi();
  const { metadata, metaBuffer } = useMetadata(metaWasm);
  const [state, setState] = useState<State>();
  const [isStateRead, setIsStateRead] = useState(false);

  const sendMessage = useSendMessage(ADDRESS.CONTRACT, metadata);

  const readState = (isInitLoad?: boolean) => {
    if (metaBuffer) {
      if (isInitLoad) setIsStateRead(false);

      api.programState
        .read(ADDRESS.CONTRACT, metaBuffer)
        .then((codecState) => codecState.toHuman())
        .then((result) => setState(result as State))
        .catch(({ message }: Error) => alert.error(message))
        .finally(() => setIsStateRead(true));
    }
  };

  useEffect(() => {
    if (ADDRESS.CONTRACT && metaBuffer) readState(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metaBuffer]);

  const handleStateChange = ({ data }: MessagesDispatched) => {
    const changedIDs = data.stateChanges.toHuman() as Hex[];
    const isAnyChange = changedIDs.some((id) => id === ADDRESS.CONTRACT);

    if (isAnyChange) readState();
  };

  useEffect(() => {
    let unsub: UnsubscribePromise | undefined;

    if (api && ADDRESS.CONTRACT && metaBuffer) {
      unsub = api.gearEvents.subscribeToGearEvent('MessagesDispatched', handleStateChange);
    }

    return () => {
      if (unsub) unsub.then((unsubCallback) => unsubCallback());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api, ADDRESS.CONTRACT, metaBuffer]);

  const register = (player: Hex) => sendMessage({ Register: { player } }, { onSuccess: () => setProgramId(player) });
  const startGame = () => sendMessage({ Play: null });

  const { admin } = state || {};
  const isAdmin = account?.decodedAddress === admin;

  const getDecodedPayload = (payload: Vec<u8>) => {
    // handle_output is specific for contract
    if (metadata?.handle_output) {
      return new CreateType().create(metadata.handle_output, payload, metadata).toHuman();
    }
  };

  const [steps, setSteps] = useState<Step[]>([]);
  const isGameStarted = steps.length > 0;

  const [step, setStep] = useState(0);

  useEffect(() => {
    if (steps.length > 0) setStep(steps.length - 1);
  }, [steps]);

  const prevStep = () => setStep((prevValue) => (prevValue - 1 >= 0 ? prevValue - 1 : prevValue));
  const nextStep = () => setStep((prevValue) => (prevValue + 1 < steps.length ? prevValue + 1 : prevValue));
  const firstStep = () => setStep(0);
  const lastStep = () => setStep(steps.length - 1);

  const roll = steps[step];
  const { properties, ownership } = roll || {};

  useEffect(() => {
    let unsub: UnsubscribePromise | undefined;

    if (metadata) {
      unsub = api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data }) => {
        const { message } = data;
        const { source, payload } = message;

        if (source.toHex() === ADDRESS.CONTRACT) {
          const decodedPayload = getDecodedPayload(payload) as MessagePayload;

          if (typeof decodedPayload === 'object' && decodedPayload !== null) {
            // @ts-ignore
            if (decodedPayload.Step) {
              // @ts-ignore
              setSteps((prevSteps) => [...prevSteps, decodedPayload.Step]);
            }
            // @ts-ignore
            else if (decodedPayload.GameFinished) {
              // @ts-ignore
              setWinner(decodedPayload.GameFinished.winner);
            }
          }
        }
      });
    }

    return () => {
      if (unsub) unsub.then((unsubCallback) => unsubCallback());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metadata]);

  const getPlayers = () => (isGameStarted ? roll.players : state!.players!);

  const playerIds = state?.players ? (Object.keys(state.players) as Hex[]) : [];
  const players = playerIds.map((address, index) => ({
    ...INIT_PLAYERS[index],
    address,
    ...getPlayers()[address],
  }));
  const isAnyPlayer = players.length > 0;

  const getColor = (address: Hex) => players?.find((player) => player.address === address)?.color;

  const getFields = () =>
    fields.map(({ Image, values, type }, index) => (
      <Cell
        // eslint-disable-next-line react/no-array-index-key
        key={index}
        index={index}
        players={players}
        Image={Image}
        ownership={ownership}
        properties={properties}
        card={values}
        type={type}
      />
    ));

  const { winner = '' as Hex } = state || {};

  useEffect(() => {
    if (winner)
      setSteps((prevSteps) =>
        [...prevSteps].sort(({ currentStep }, { currentStep: anotherStep }) => +currentStep - +anotherStep),
      );
  }, [winner]);

  return isStateRead ? (
    <>
      <div className={styles.players}>
        {isAnyPlayer && <Players list={players} winner={winner} />}
        <Button text="Exit" onClick={resetProgramId} />
      </div>

      <div className={styles.field}>
        <div className={styles.wrapper}>
          {getFields()}
          <div className={styles.controller}>
            {isGameStarted ? (
              <Roll
                color={getColor(roll.currentPlayer)}
                player={roll.currentPlayer}
                currentTurn={step + 1}
                turnsAmount={steps.length}
                onPrevClick={prevStep}
                onNextClick={nextStep}
                onFirstClick={firstStep}
                onLastClick={lastStep}
                onMainClick={isAdmin ? startGame : undefined}
              />
            ) : (
              <>
                <h1 className={styles.heading}>Syndote Game</h1>
                <p className={styles.subheading}>
                  {isAdmin ? 'Press play to start' : 'Waiting for admin to start a game'}
                </p>
                <Buttons onMainClick={isAdmin ? startGame : undefined} />
              </>
            )}
          </div>
        </div>
      </div>
      {account ? !programId && <Address onSubmit={register} onBack={logout} /> : <Connect />}
    </>
  ) : (
    <Loader />
  );
}

export { Home };
