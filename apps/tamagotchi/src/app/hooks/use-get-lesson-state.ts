import { useAlert, useApi } from '@gear-js/react-hooks';
import { useCallback, useContext } from 'react';
import { TmgContext } from '../context';
import { createTamagotchiInitial } from '../consts';
import { LessonsAll } from 'app/types/lessons';
import { getLessonMetadata } from 'app/utils/get-lesson-metadata';

type Props = typeof createTamagotchiInitial;

export function useGetLessonState() {
  const { api } = useApi();
  const alert = useAlert();
  const { setState } = useContext(TmgContext);

  const create = useCallback(
    async ({ programId, currentStep }: Props) => {
      setState({ programId, lesson: Number(currentStep) });

      try {
        const metadata = await getLessonMetadata(Number(currentStep));
        const resT = await api.programState.read({ programId }, metadata);

        setState({
          programId,
          lesson: Number(currentStep),
          tamagotchi: resT.toJSON() as LessonsAll,
        });
      } catch (e) {
        alert.error((e as Error).message);
        setState(undefined);
      }
    },
    [alert, api.programState, setState],
  );

  return { create };
}
