import { useEffect, useState } from 'react';
import { getProgramMetadata, ProgramMetadata } from '@gear-js/api';
import { getLessonAssets } from 'app/utils/get-lesson-assets';
import { useTamagotchi } from '../context';

export const useLessonMetadata = () => {
  const { lesson } = useTamagotchi();
  const [data, setData] = useState<ProgramMetadata>();

  useEffect(() => {
    if (lesson?.step) {
      fetch(getLessonAssets(lesson.step))
        .then((res) => res.text() as Promise<string>)
        .then((raw) => getProgramMetadata(`0x${raw}`))
        .then((meta) => setData(meta));
    }
  }, [lesson]);

  return { metadata: data };
};
