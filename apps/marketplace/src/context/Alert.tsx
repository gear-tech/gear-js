import { positions, Provider } from 'react-alert';
import Alert from 'components/alert';
import Props from './types';

function AlertProvider({ children }: Props) {
  return (
    <Provider template={Alert} position={positions.BOTTOM_CENTER} timeout={5000}>
      {children}
    </Provider>
  );
}

export default AlertProvider;
