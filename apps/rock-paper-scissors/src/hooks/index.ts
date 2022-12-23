import { useState } from 'react';
import { useWasm } from './context';
import { useMsToTime } from './useMsToTime';
import { useRockPaperScissors } from './useGetState';
import { useCreateRockPaperScissors, useRockPaperScissorsMessage } from './api';

const useRoute = () => {
  const [route, setRoute] = useState('');
  return { route, setRoute };
};

export {
  useWasm,
  useRoute,
  useMsToTime,
  useRockPaperScissors,
  useCreateRockPaperScissors,
  useRockPaperScissorsMessage,
};
