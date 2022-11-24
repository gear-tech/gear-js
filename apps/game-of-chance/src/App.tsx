import { useApi, useAccount } from '@gear-js/react-hooks';
import { Routing } from 'pages';
import { Header, Footer, ApiLoader } from 'components';
import { withProviders } from 'hocs';
import { useWasm } from 'hooks';
import 'App.scss';

function Component() {
  const { isApiReady } = useApi();
  const { isAccountReady } = useAccount();
  const wasm = useWasm();

  return (
    <>
      <Header isAccountVisible={isAccountReady} />
      <main>{isApiReady && isAccountReady && wasm ? <Routing /> : <ApiLoader />}</main>
      <Footer />
    </>
  );
}

export const App = withProviders(Component);
