import { ComponentType } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ApiProvider, AccountProvider, IPFSProvider, AlertProvider, LoadingProvider } from 'context';
import { useApi, useLoading } from 'hooks';
import Routing from 'pages';
import { Header, Footer } from 'components';
import './App.scss';
import Loader from 'components/loader';

const providers = [BrowserRouter, AlertProvider, ApiProvider, AccountProvider, IPFSProvider, LoadingProvider];

function withProviders(Component: ComponentType) {
  return () => providers.reduceRight((children, Provider) => <Provider>{children}</Provider>, <Component />);
}

function App() {
  const { isApiReady } = useApi();
  const { isLoading } = useLoading();

  return (
    <>
      <Header />
      <main>
        {isApiReady ? <Routing /> : <p className="loader">Initializing API...</p>}
        {isLoading && <Loader />}
      </main>
      <Footer />
    </>
  );
}

export default withProviders(App);
