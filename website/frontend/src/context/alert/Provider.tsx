import { ReactNode } from 'react';
import { Provider, positions, transitions, AlertOptions } from 'react-alert';
import { ZIndexes } from 'consts';
import { AlertTemplate } from 'components/AlertTemplate';

type Props = {
  children: ReactNode;
};

const options: AlertOptions = {
  position: positions.BOTTOM_RIGHT,
  timeout: 10000,
  transition: transitions.FADE,
  containerStyle: {
    zIndex: ZIndexes.alert,
    width: '390px',
    left: 'unset',
    right: '22px',
    bottom: '5px',
    alignItems: 'stretch',
  },
};

const AlertProvider = ({ children }: Props) => <Provider template={AlertTemplate} children={children} {...options} />;

export { AlertProvider };
