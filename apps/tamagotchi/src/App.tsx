import './index.css';
import './App.scss';
import { useApi, useAccount } from '@gear-js/react-hooks';
// import { useWasm } from 'app/hooks';
import { Footer, Header } from 'components/layout';
import { ApiLoader } from 'components/loaders/api-loader';
import { withProviders } from 'app/hocs';
import { Routing } from './pages';

const Component = () => {
  const { isApiReady } = useApi();
  const { isAccountReady } = useAccount();
  // const wasm = useWasm();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container pb-5">{isApiReady && isAccountReady ? <Routing /> : <ApiLoader />}</main>
      <Footer />
    </div>
  );
};

export const App = withProviders(Component);
