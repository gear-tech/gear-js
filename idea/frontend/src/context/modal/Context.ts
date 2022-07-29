import { createContext } from 'react';

import { ModalContainerFactory } from './types';

const ModalContext = createContext({} as ModalContainerFactory);

export { ModalContext };
