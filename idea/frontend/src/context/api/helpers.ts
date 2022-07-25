import { isNodeAddressValid } from 'helpers';
import { NODE_ADRESS_URL_PARAM } from 'consts';

export const getNodeAddressFromUrl = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const nodeAddress = searchParams.get(NODE_ADRESS_URL_PARAM) || '';

  return isNodeAddressValid(nodeAddress) && nodeAddress;
};
