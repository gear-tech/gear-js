import { ApiProvider as Provider } from '@gear-js/react-hooks';

import { Props } from '../types';
import { NODE_API_ADDRESS } from './const';

const ApiProvider = ({ children }: Props) => <Provider providerAddress={NODE_API_ADDRESS}>{children}</Provider>;

export { ApiProvider };
