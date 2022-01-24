import { Event } from '@polkadot/types/interfaces';

export const getCaption = ({ method, section }: Event) => `${section}.${method}`;
