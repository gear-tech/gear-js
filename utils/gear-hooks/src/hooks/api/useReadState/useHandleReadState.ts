import { AnyJson, Codec } from '@polkadot/types/types';
import { useContext, useState, useEffect } from 'react';
import { AlertContext } from 'context';

function useHandleReadState<T = AnyJson>(
  handleReadState: () => Promise<Codec> | undefined,
  isReadOnError: boolean | undefined,
) {
  const alert = useContext(AlertContext);

  const [state, setState] = useState<T>();
  const [error, setError] = useState('');
  const [isStateRead, setIsStateRead] = useState(true);

  const resetError = () => setError('');

  const readState = (isInitLoad?: boolean) => {
    if (isInitLoad) setIsStateRead(false);

    handleReadState()
      ?.then((codecState) => codecState.toJSON())
      .then((result) => {
        setState(result as unknown as T);
        if (!isReadOnError) setIsStateRead(true);
      })
      .catch(({ message }: Error) => setError(message))
      .finally(() => {
        if (isReadOnError) setIsStateRead(true);
      });
  };

  useEffect(() => {
    if (error) alert.error(error);
  }, [error]);

  return { state, isStateRead, error, readState, resetError };
}

export { useHandleReadState };
