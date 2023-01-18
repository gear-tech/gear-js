import { useAlert, useApi } from '@gear-js/react-hooks';
import { useCallback, useContext } from 'react';
import { AppCtx } from '../context';
import { createTamagotchiInitial } from '../consts';
import { TamagotchiState } from 'app/types/lessons';
import { getLessonMetadata } from 'app/utils/get-lesson-metadata';

type Props = typeof createTamagotchiInitial;

export function useGetLessonState() {
  const { api } = useApi();
  const alert = useAlert();
  const { setLesson, setTamagotchi } = useContext(AppCtx);

  const create = useCallback(async ({ programId, currentStep }: Props) => {
    setLesson({ programId, step: Number(currentStep) });

    try {
      const metadata = await getLessonMetadata(Number(currentStep));
      const res = await api.programState.read({ programId }, metadata);
      setTamagotchi(res.toJSON() as TamagotchiState);
    } catch (e) {
      alert.error((e as Error).message);
      setTamagotchi(undefined);
    }
  }, []);

  return { create };
}
