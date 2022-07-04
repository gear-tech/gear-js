import { AlertProvider as Provider } from '@gear-js/react-hooks';

import { Props } from '../types';

import { AlertTemplate } from 'components/AlertTemplate';
import globalStyles from 'components/Alert/Wrapper.module.scss';

const AlertProvider = ({ children }: Props) => (
  <Provider template={AlertTemplate} containerClassName={globalStyles.alertWrapper}>
    {children}
  </Provider>
);

export { AlertProvider };
