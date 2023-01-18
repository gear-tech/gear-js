import { useContext, useEffect, useState } from 'react';
import { getProgramMetadata, ProgramMetadata } from '@gear-js/api';
import { getLessonAssets } from 'app/utils/get-lesson-assets';
import { AppCtx } from '../context';

export const useLessonMetadata = () => {
  const { lesson } = useContext(AppCtx);
  const [data, setData] = useState<ProgramMetadata>();

  useEffect(() => {
    if (lesson?.step) {
      fetch(getLessonAssets(lesson.step).tamagotchi)
        .then((res) => res.text() as Promise<string>)
        .then((raw) => getProgramMetadata(`0x${raw}`))
        .then((meta) => setData(meta));
    }
  }, [lesson?.step]);

  return { metadata: data };
};
