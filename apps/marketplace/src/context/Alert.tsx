import { positions, Provider } from 'react-alert';
import Alert from 'components/alert';
import Props from './types';

const style = {
  padding: '0 16px 8px 0',
};

function AlertProvider({ children }: Props) {
  return (
    <Provider template={Alert} position={positions.BOTTOM_RIGHT} containerStyle={style} timeout={5000}>
      {children}
    </Provider>
  );
}

export default AlertProvider;
