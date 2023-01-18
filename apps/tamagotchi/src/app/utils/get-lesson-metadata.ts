import { getProgramMetadata, ProgramMetadata } from '@gear-js/api';
import { getLessonAssets } from 'app/utils/get-lesson-assets';

export const getLessonMetadata = async (lesson: number): Promise<ProgramMetadata> => {
  return await fetch(getLessonAssets(lesson))
    .then((response) => response.text() as Promise<string>)
    .then((data) => getProgramMetadata(`0x${data}`));
};
