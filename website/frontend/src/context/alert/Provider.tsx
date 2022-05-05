import { ReactNode } from 'react';
import { Provider, positions } from 'react-alert';
import { ZIndexes } from 'consts';
import { AlertTemplate } from 'components/AlertTemplate';

type Props = {
  children: ReactNode;
};

const options = {
  position: positions.BOTTOM_CENTER,
  timeout: 10000,
  containerStyle: {
    zIndex: ZIndexes.alert,
    width: '100%',
    maxWidth: '600px',
    minWidth: '300px',
    margin: 'auto',
    left: 0,
    right: 0,
  },
};

const AlertProvider = ({ children }: Props) => <Provider template={AlertTemplate} children={children} {...options} />;

export { AlertProvider };
