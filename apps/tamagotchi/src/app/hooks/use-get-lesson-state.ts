import { useAlert, useApi } from '@gear-js/react-hooks';
import { useCallback, useContext } from 'react';
import { LessonsContext } from '../context';
import txt from 'assets/meta/meta.txt';
import { getProgramMetadata, Hex } from '@gear-js/api';
import { LessonsAll } from 'app/types/lessons';

export function useGetLessonState() {
  const { api } = useApi();
  const alert = useAlert();
  const { setTamagotchi } = useContext(LessonsContext);

  const create = useCallback(
    async (hex: Hex) => {
      try {
        const metadata = await fetch(txt)
          .then((response) => response.text() as Promise<string>)
          .then((data) => getProgramMetadata(`0x${data}`));
        const res = await api.programState.read({ programId: hex }, metadata);
        setTamagotchi(res.toJSON() as LessonsAll);
      } catch (e) {
        alert.error((e as Error).message);
        setTamagotchi(undefined);
      }
    },
    [alert, api.programState, setTamagotchi],
  );

  return { create };
}
