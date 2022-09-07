import { useApi, useBalanceSubscription, useLoggedInAccount } from '@gear-js/react-hooks';
import { Routing } from 'pages';
import { Header, Footer, ApiLoader } from 'components';
import { withProviders } from 'hocs';
import { useWasm } from 'hooks';
import 'App.scss';

function Component() {
  const { isApiReady } = useApi();
  const { isLoginReady } = useLoggedInAccount();
  const wasm = useWasm();

  useBalanceSubscription();

  return (
    <>
      <Header isAccountVisible={isLoginReady} />
      <main>{isApiReady && isLoginReady && wasm ? <Routing /> : <ApiLoader />}</main>
      <Footer />
    </>
  );
}

export const App = withProviders(Component);
