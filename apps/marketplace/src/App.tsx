import { useApi, useBalanceSubscription, useLoggedInAccount } from '@gear-js/react-hooks';
import { Routing } from 'pages';
import { Header, Footer, ApiLoader } from 'components';
import { withProviders } from 'hocs';
import { useWasm } from 'hooks';
import 'App.scss';

function Component() {
  const { isApiReady } = useApi();
  const { isLoginReady } = useLoggedInAccount();

  const { nft, marketplace } = useWasm();
  const isEachWasmReady = nft && marketplace;

  useBalanceSubscription();

  return (
    <>
      <Header isAccountVisible={isLoginReady} />
      <main>{isApiReady && isLoginReady && isEachWasmReady ? <Routing /> : <ApiLoader />}</main>
      <Footer />
    </>
  );
}

export const App = withProviders(Component);
