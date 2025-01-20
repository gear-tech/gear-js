import { ProviderProps, AlertProvider as GearAlertProvider } from '@gear-js/react-hooks';
import { Alert, alertStyles } from '@gear-js/ui';

const AlertProvider = ({ children }: ProviderProps) => (
  <GearAlertProvider template={Alert} containerClassName={alertStyles.root}>
    {children}
  </GearAlertProvider>
);

export { AlertProvider };
