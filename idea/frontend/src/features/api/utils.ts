import { NODE_ADRESS_URL_PARAM } from '@/shared/config';
import { isNodeAddressValid } from '@/shared/helpers';

const getNodeAddressFromUrl = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const nodeAddress = searchParams.get(NODE_ADRESS_URL_PARAM);

  if (nodeAddress && isNodeAddressValid(nodeAddress)) return nodeAddress;
};

export { getNodeAddressFromUrl };
