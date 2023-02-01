import {useApi} from '@gear-js/react-hooks'
import {useEffect} from 'react'
import {UnsubscribePromise} from '@polkadot/api/types'
import {useLesson} from '../context'

export const useLesson5 = () => {
  const { lesson, meta } = useLesson();

  const { api } = useApi();

  useEffect(() => {
    let unsub: UnsubscribePromise | undefined;

    if (meta && lesson?.step === 5) {
      unsub = api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data }) => {
        const { message } = data;
        const { source, payload } = message;

        if (source.toHex() === lesson?.programId) {
          const decodedPayload = meta.createType(8, payload).toHuman() as unknown;
          console.log({ decodedPayload });

          if (typeof decodedPayload === 'object' && decodedPayload !== null) {
            // if (decodedPayload.Step) {
            //   setSteps((prevSteps) => [...prevSteps, decodedPayload.Step]);
            // }
            // else if (decodedPayload.GameFinished) {
            //   setWinner(decodedPayload.GameFinished.winner);
            // }
          }
        }
      });
    }

    return () => {
      if (unsub) unsub.then((unsubCallback) => unsubCallback());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meta]);
}
