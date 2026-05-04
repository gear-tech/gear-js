import { createContext } from 'react';

import type { ModalContainerFactory } from './types';

const ModalContext = createContext({} as ModalContainerFactory);

export { ModalContext };
