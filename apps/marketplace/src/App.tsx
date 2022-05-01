import { ComponentType } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ApiProvider, AccountProvider, IPFSProvider, AlertProvider, LoadingProvider } from 'context';
import { useApi, useLoading } from 'hooks';
import { Header, Footer, Loader } from 'components';
import Routing from 'pages';
import './App.scss';

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
