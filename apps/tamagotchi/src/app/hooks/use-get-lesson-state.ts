import { useAlert, useApi, useMetadata } from '@gear-js/react-hooks';
import { useCallback, useContext } from 'react';
import { LessonsContext } from '../context';
import txt1 from 'assets/meta/meta1.txt';
import txt2 from 'assets/meta/meta2.txt';
import wasm2 from 'assets/meta/state2.meta.wasm';
import { CreateType, getProgramMetadata, getStateMetadata } from '@gear-js/api';
import { LessonsAll } from 'app/types/lessons';
import { createTamagotchiInitial } from '../consts';

type Props = typeof createTamagotchiInitial;

type ITmgCurrentState = {
  fed: number;
  entertained: number;
  rested: number;
};

const payload: ITmgCurrentState = {
  entertained: 0,
  fed: 0,
  rested: 0,
};

export function useGetLessonState() {
  const { api } = useApi();
  const alert = useAlert();
  const { setTamagotchi, setLesson } = useContext(LessonsContext);
  const { metaBuffer, metadata } = useMetadata(wasm2);

  const create = useCallback(
    async ({ programId, currentStep }: Props) => {
      const getCurrentStep = (): string => {
        switch (Number(currentStep)) {
          case 1:
            console.log('selected lesson 1');
            return txt1;
          case 2:
            console.log('selected lesson 2');
            return txt2;
          default:
            console.log('selected default');
            return txt1;
        }
      };

      setLesson(currentStep);

      try {
        const metadata = await fetch(getCurrentStep())
          .then((response) => response.text() as Promise<string>)
          .then((data) => getProgramMetadata(`0x${data}`));

        const res = await api.programState.read({ programId }, metadata);
        // const test = await api.message.send({}, metadata: 'dfdfg')
        console.log(res.toJSON());
        // console.log(metadata.getTypeDef(1));
        setTamagotchi(res.toJSON() as LessonsAll);

        // const meta = await getStateMetadata(metaBuffer as Buffer);
        // console.log(meta);
        // console.log(meta.getTypeName(0));
        // const meta = await getStateMetadata(metaBuffer as Buffer);

        // const state = await api.programState.readUsingWasm(
        //   {
        //     programId,
        //     fn_name: 'test_state',
        //     wasm: metaBuffer as Buffer,
        //     // argument: payload,
        //   },
        //   meta,
        // );
        //
        // // const result = CreateType.create('TmgCurrentState', payload);
        //
        // console.log('state: ', state.toJSON());
        // // console.log('result: ', result.toJSON());
      } catch (e) {
        alert.error((e as Error).message);
        setTamagotchi(undefined);
      }
    },
    [alert, api.programState, setLesson, setTamagotchi],
  );

  return { create };
}
