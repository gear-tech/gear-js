import { useApi, useAccount } from '@gear-js/react-hooks';
import { Routing } from 'pages';
import { ApiLoader } from 'components';
import { withProviders } from 'hocs';
import 'simplebar-react/dist/simplebar.min.css';
import 'App.scss';

function Component() {
  const { isApiReady } = useApi();
  const { isAccountReady } = useAccount();

  return <main>{isApiReady && isAccountReady ? <Routing /> : <ApiLoader />}</main>;
}

export const App = withProviders(Component);
