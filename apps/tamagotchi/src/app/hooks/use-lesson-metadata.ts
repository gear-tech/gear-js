import { getProgramMetadata, ProgramMetadata } from '@gear-js/api';
import { getLessonAssets } from 'app/utils/get-lesson-assets';
import { useContext, useEffect, useState } from 'react';
import { TmgContext } from '../context';

export const useLessonMetadata = () => {
  const { state } = useContext(TmgContext);
  const [data, setData] = useState<ProgramMetadata>();

  useEffect(() => {
    if (state?.lesson) {
      console.log('fetch lessons metadata');
      fetch(getLessonAssets(state.lesson))
        .then((res) => res.text() as Promise<string>)
        .then((raw) => getProgramMetadata(`0x${raw}`))
        .then((meta) => setData(meta));
    }
  }, [state?.lesson]);

  return { metadata: data };
};
