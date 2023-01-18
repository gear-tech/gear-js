import { useAlert, useApi } from '@gear-js/react-hooks';
import { useCallback, useContext } from 'react';
import { AppCtx } from '../context';
import type { TamagotchiState } from 'app/types/lessons';
import { useLessonMetadata } from './use-lesson-metadata';

export const useUpdateState = () => {
  const { api } = useApi();
  const alert = useAlert();
  const { lesson, setLesson, setTamagotchi, isDirty, setIsDirty, reset } = useContext(AppCtx);
  const { metadata } = useLessonMetadata();

  const update = useCallback(() => {
    if (lesson && metadata) {
      const { programId, step } = lesson;
      Promise.resolve(api.programState.read({ programId }, metadata))
        .then((res) => {
          setLesson({ programId, step });
          setTamagotchi(res.toJSON() as TamagotchiState);
        })
        .catch((e) => {
          alert.error((e as Error).message);
          reset();
        })
        .finally(() => (!isDirty ? setIsDirty(true) : null));
    }
  }, [lesson, metadata]);

  return { update };
};
