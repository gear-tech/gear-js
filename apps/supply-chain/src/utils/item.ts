import { Hex } from '@gear-js/api';
import { Item, Token } from 'types';

const isEmptyHex = (value: Hex) => value.startsWith('0x00');

const getAddress = (value: Hex) => (isEmptyHex(value) ? ('' as Hex) : value);

const getItemData = (item: Item, nft: Token) => {
  const { state } = item;
  const { name, description } = nft;

  const producer = getAddress(item.producer);
  const distributor = getAddress(item.distributor);
  const retailer = getAddress(item.retailer);

  return { name, description, state, producer, distributor, retailer };
};

export { getItemData };
