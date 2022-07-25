import { AlertProvider as Provider } from '@gear-js/react-hooks';

import { Props } from '../types';

import { AlertTemplate } from 'components/AlertTemplate';

const AlertProvider = ({ children }: Props) => <Provider template={AlertTemplate}>{children}</Provider>;

export { AlertProvider };
