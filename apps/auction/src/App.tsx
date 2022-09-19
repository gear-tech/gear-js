import { useApi, useAccount } from '@gear-js/react-hooks';
import { Routing } from 'pages';
import { Header, Footer, ApiLoader } from 'components';
import { withProviders } from 'hocs';
import { useWasm } from 'hooks';
import 'App.scss';

function Component() {
  const { isApiReady } = useApi();
  const { isAccountReady } = useAccount();

  const { nft, auction } = useWasm();
  const isEachWasmReady = nft && auction;

  return (
    <>
      <Header isAccountVisible={isAccountReady} />
      <main>{isApiReady && isAccountReady && isEachWasmReady ? <Routing /> : <ApiLoader />}</main>
      <Footer />
    </>
  );
}

export const App = withProviders(Component);
