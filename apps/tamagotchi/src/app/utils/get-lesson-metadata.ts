import { getProgramMetadata } from '@gear-js/api';
import { getLessonAssets } from 'app/utils/get-lesson-assets';

export const getLessonMetadata = async (lesson: number) => {
  return await fetch(getLessonAssets(lesson))
    .then((response) => response.text() as Promise<string>)
    .then((data) => getProgramMetadata(`0x${data}`));
};
