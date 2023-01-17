import { getProgramMetadata } from '@gear-js/api';
import { getLessonAssets } from 'app/utils/get-lesson-assets';
import { LessonMetadataResponse } from '../types/lessons';

export const getLessonMetadata = async (lesson: number): Promise<LessonMetadataResponse> => {
  return {
    tamagotchi: await fetch(getLessonAssets(lesson).tamagotchi)
      .then((response) => response.text() as Promise<string>)
      .then((data) => getProgramMetadata(`0x${data}`)),
    store:
      lesson > 3
        ? await fetch(getLessonAssets(lesson).store as RequestInfo | URL)
            .then((response) => response.text() as Promise<string>)
            .then((data) => getProgramMetadata(`0x${data}`))
        : undefined,
  };
};
