import { useAlert, useApi } from '@gear-js/react-hooks';
import { useCallback } from 'react';
import { useLesson } from '../context';
import type { TamagotchiState } from 'app/types/lessons';

export const useUpdateState = () => {
  const { api } = useApi();
  const alert = useAlert();
  const { lesson, meta, setTamagotchi, isFetched, setIsFetched, reset } = useLesson();

  const update = useCallback(() => {
    if (lesson && meta) {
      console.log('fake updated');
      // Promise.resolve(api.programState.read({ programId: lesson.programId }, meta))
      //   .then((res) => {
      //     setTamagotchi(res.toJSON() as TamagotchiState);
      //   })
      //   .catch((e) => {
      //     alert.error((e as Error).message);
      //     reset();
      //   })
      //   .finally(() => (!isFetched ? setIsFetched(true) : null));
    }
  }, [api, lesson, meta]);

  return { update };
};
