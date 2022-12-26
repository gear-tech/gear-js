import { useState } from 'react';
import { useWasm } from './context';
import { useMsToTime } from './useMsToTime';
import { useRockPaperScissors } from './useRockPaperScissors';
import { useCreateRockPaperScissors, useRockPaperScissorsMessage } from './api';

const useRoute = () => {
  const [route, setRoute] = useState('');
  return { route, setRoute };
};

const useLoading = () =>{
  const [loading, setLoading] = useState(false);
return {loading, setLoading} 
}

export {
  useWasm,
  useRoute,
  useMsToTime,
  useRockPaperScissors,
  useCreateRockPaperScissors,
  useRockPaperScissorsMessage,
  useLoading
};
