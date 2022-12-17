import './index.css';
import 'App.scss';
import { useApi, useAccount } from '@gear-js/react-hooks';
import { Routing } from 'pages';
import { Header, Footer, ApiLoader } from 'components';
import { withProviders } from 'hocs';
import { useWasm } from 'hooks';

function Component() {
  const { isApiReady } = useApi();
  const { isAccountReady } = useAccount();
  const wasm = useWasm();

  return (
    <div className="page">
      <Header />
      <main className="page__content container pb-5">
        {isApiReady && isAccountReady && wasm ? <Routing /> : <ApiLoader />}
      </main>
      <Footer />
    </div>
  );
}

export const App = withProviders(Component);
