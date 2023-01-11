import { useAlert, useApi } from '@gear-js/react-hooks';
import { useCallback, useContext } from 'react';
import { TmgContext } from '../context';
import { LessonsAll } from 'app/types/lessons';
import { createTamagotchiInitial } from '../consts';
import { getLessonMetadata } from 'app/utils/get-lesson-metadata';

type Props = typeof createTamagotchiInitial;

export function useGetLessonState() {
  const { api } = useApi();
  const alert = useAlert();
  const { state, setState } = useContext(TmgContext);

  const create = useCallback(
    async ({ programId, currentStep }: Props) => {
      setState({ programId, lesson: Number(currentStep) });
      console.log('state in lesson', state);

      try {
        const metadata = await getLessonMetadata(Number(currentStep));
        console.log({ metadata });
        const res = await api.programState.read({ programId }, metadata);
        console.log(res.toJSON());
        setState({ programId, lesson: Number(currentStep), tamagotchi: res.toJSON() as LessonsAll });
      } catch (e) {
        alert.error((e as Error).message);
        setState(undefined);
      }
    },
    [alert, api.programState, setState, state],
  );

  return { create };
}

// const { metadata } = useLessonMetadata();
// const { metaBuffer, metadata } = useMetadata(wasm2);

// console.log(metadata.getTypeDef(1));
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
