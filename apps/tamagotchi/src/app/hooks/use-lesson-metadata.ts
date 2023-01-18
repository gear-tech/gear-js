import { useContext, useEffect, useState } from 'react';
import { getProgramMetadata, ProgramMetadata } from '@gear-js/api';
import { getLessonAssets } from 'app/utils/get-lesson-assets';
import { TmgContext } from '../context';

export const useLessonMetadata = () => {
  const { state } = useContext(TmgContext);
  const [data, setData] = useState<ProgramMetadata>();

  useEffect(() => {
    if (state?.lesson) {
      fetch(getLessonAssets(state.lesson).tamagotchi)
        .then((res) => res.text() as Promise<string>)
        .then((raw) => getProgramMetadata(`0x${raw}`))
        .then((meta) => setData(meta));
    }
  }, [state?.lesson]);

  return { metadata: data };
};
