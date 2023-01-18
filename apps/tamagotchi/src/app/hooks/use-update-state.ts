import { useAlert, useApi } from '@gear-js/react-hooks';
import { useCallback, useContext } from 'react';
import { TmgContext } from '../context';
import { LessonsAll } from '../types/lessons';
import { useLessonMetadata } from './use-lesson-metadata';

export const useUpdateState = () => {
  const { api } = useApi();
  const alert = useAlert();
  const { state, setState } = useContext(TmgContext);
  const { metadata } = useLessonMetadata();

  const update = useCallback(() => {
    if (state && metadata) {
      const { programId, lesson, isDirty } = state;
      Promise.resolve(api.programState.read({ programId }, metadata))
        .then((res) =>
          setState({
            programId,
            lesson,
            tamagotchi: res.toJSON() as LessonsAll,
          }),
        )
        .catch((e) => {
          alert.error((e as Error).message);
          setState(undefined);
        })
        .finally(() => (!isDirty ? setState({ ...state, isDirty: true }) : null));
    }
  }, [alert, api.programState, metadata, setState, state]);

  return { update };
};
