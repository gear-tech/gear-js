import { Header } from '@polkadot/types/interfaces';
import { useDispatch } from 'react-redux';
import { fetchBlockAction } from 'store/actions/actions';
import { useApi } from './useApi';
import { useSubscription } from './useSubscription';

export function useBlocks() {
  const [api] = useApi();
  const dispatch = useDispatch();

  const setBlock = ({ hash, number }: Header) => {
    dispatch(fetchBlockAction({ hash: hash.toHex(), number: number.toNumber() }));
  };

  const subscribeToBlocks = () => api.gearEvents.subscribeToNewBlocks(setBlock);

  useSubscription(subscribeToBlocks);
}
