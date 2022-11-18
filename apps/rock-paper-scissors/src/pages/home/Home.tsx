import { useState, useMemo } from 'react';
import { useCreateHandler, useReadState } from '@gear-js/react-hooks';
import { Hex } from '@gear-js/api';
import { useWasm, useMsToTime } from 'hooks';
import { ApiLoader } from 'components';
import { useForm } from 'utils'
import { StateConfigType, StateTimeStampType, StateGameStageType } from 'types'
import { Create } from './create';
import { Start } from './start';
import { Game } from './game';
import { Details } from './details';
import { ReactComponent as GearBgSVG } from '../../assets/images/backgrounds/gearBG.svg'


function useCreateRockPaperScissors() {
  const { codeHash, meta } = useWasm();
  return useCreateHandler(codeHash, meta);
}

const players: Array<Hex> = ['0x01', '0x02', '0x03', '0x04', '0x05', '0x06'];


const useConfig = () => {
  const configState = useMemo(() => ({ Config: null }), []);
  const configTimeStamp = useMemo(() => ({ CurrentStageTimestamp: null }), []);
  const configGameStage = useMemo(() => ({ GameStage: null }), []);
  return { configState, configTimeStamp, configGameStage }
}


function Home() {
  const [programmID, setProgrammID] = useState<Hex | undefined>();
  const { form, onClickRouteChange } = useForm();
  const create = useCreateRockPaperScissors();
  const { metaBuffer } = useWasm();
  const { configState, configTimeStamp, configGameStage } = useConfig()

  const gameState = useReadState<StateConfigType>(programmID, metaBuffer, configState);
  const timeState = useReadState<StateTimeStampType>(programmID, metaBuffer, configTimeStamp);
  const gameStageState = useReadState<StateGameStageType>(programmID, metaBuffer, configGameStage);

  const { isStateRead, state } = gameState;

  const timeLeft: string | undefined = timeState.state?.CurrentStageTimestamp
  const { minutes, hours, seconds } = useMsToTime(timeLeft)


  const gameStage = gameStageState.state?.GameStage;

  const { betSize, moveTimeoutMs, revealTimeoutMs, entryTimeoutMs } = state?.Config || {}

  const onClickCreate = (hex: Hex) => {
    onClickRouteChange('lobby')
    setProgrammID(hex);
  }


  return (
    <>
      {!form && (
        <Start games={[]} ownerGames={[]} onCreateClick={onClickRouteChange} />
      )}
      {form === 'create' && (
        <Create onBackClick={onClickRouteChange} onSubmit={create} setStateAction={onClickCreate} />
      )}
      {form === 'lobby' && (isStateRead ?
        <Game
          players={players}
          onBackClick={onClickRouteChange}
          heading='somth heading'
          stage={gameStage}
          bet={betSize}
          game='current game'
          round='0'
          hoursLeft={hours}
          minutesLeft={minutes}
          secondsLeft={seconds}
        /> : <ApiLoader />
      )
      }
      {form === 'detail' &&
        <Details
          heading='somth heading'
          game='current game'
          round='0'
          bet={betSize}
          players={players}
          contract={programmID}
          move={moveTimeoutMs}
          reveal={revealTimeoutMs}
          entry={entryTimeoutMs}
          SVG={GearBgSVG}
          onBackClick={onClickRouteChange}
        />}
    </>
  )
}

export { Home };
