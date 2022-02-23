import { Header } from '@polkadot/types/interfaces';
import { IU8a } from '@polkadot/types/types';
import { useDispatch } from 'react-redux';
import { fetchBlockAction } from 'store/actions/actions';
import { useApi } from './useApi';
import { useSubscription } from './useSubscription';

export function useBlocks() {
  const [api] = useApi();
  const dispatch = useDispatch();

  const getTime = async (hash: IU8a) => {
    const timestamp = await api.blocks.getBlockTimestamp(hash);
    const date = new Date(timestamp.toNumber());

    return date.toLocaleTimeString();
  };

  const setBlock = async ({ hash, number }: Header) => {
    dispatch(
      fetchBlockAction({
        hash: hash.toHex(),
        number: number.toNumber(),
        time: await getTime(hash),
      })
    );
  };

  const subscribeToBlocks = () => api.gearEvents.subscribeToNewBlocks(setBlock);

  useSubscription(subscribeToBlocks);
}
