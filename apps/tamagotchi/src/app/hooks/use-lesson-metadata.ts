import { useEffect, useState } from 'react';
import { getProgramMetadata, ProgramMetadata } from '@gear-js/api';
// import { getLessonAssets } from 'app/utils/get-lesson-assets';
import { useLesson } from '../context';
import { getLessonAssets } from '../utils/get-lesson-assets';
// import { useMetadata } from './use-metadata';

// export const useLessonMetadata = () => {
//   const { lesson, isFetched, setIsFetched } = useLesson();
//   const [data, setData] = useState<ProgramMetadata>();
//
//   useEffect(() => {
//     if (lesson) {
//       fetch(getLessonAssets(lesson.step))
//         .then((res) => res.text() as Promise<string>)
//         .then((raw) => getProgramMetadata(`0x${raw}`))
//         .then((meta) => setData(meta));
//       // .finally(() => (!isFetched ? setIsFetched(true) : null));
//     }
//   }, [lesson]);
//
//   return { metadata: data };
// };

export const useLessonMetadata2 = () => {
  const { lesson } = useLesson();
  const [data, setData] = useState<ProgramMetadata>();

  useEffect(() => {
    if (lesson) {
      console.log('fetched', { lesson });
      fetch(getLessonAssets(Number(lesson?.step)))
        .then((res) => res.text() as Promise<string>)
        .then((raw) => getProgramMetadata(`0x${raw}`))
        .then((meta) => setData(meta));
    }
  }, [lesson]);

  return { metadata: data };
};
