import { useContext, useEffect, useState } from 'react';
import { getProgramMetadata } from '@gear-js/api';
import { getLessonAssets } from 'app/utils/get-lesson-assets';
import { TmgContext } from '../context';
import type { LessonMetadataResponse } from 'app/types/lessons';

export const useLessonMetadata = () => {
  const { state } = useContext(TmgContext);
  const [data, setData] = useState<LessonMetadataResponse>();

  useEffect(() => {
    if (state?.lesson) {
      fetch(getLessonAssets(state.lesson).tamagotchi)
        .then((res) => res.text() as Promise<string>)
        .then((raw) => getProgramMetadata(`0x${raw}`))
        .then((metaT) => {
          if (state.lesson > 3) {
            fetch(getLessonAssets(state.lesson).store as RequestInfo | URL)
              .then((res) => res.text() as Promise<string>)
              .then((raw) => getProgramMetadata(`0x${raw}`))
              .then((metaS) => setData({ tamagotchi: metaT, store: metaS }));
          } else {
            setData({ tamagotchi: metaT });
          }
        });
    }
  }, [state?.lesson]);

  return { metadata: data };
};
