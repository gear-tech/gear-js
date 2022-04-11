import { ComponentType } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ApiProvider, AccountProvider } from 'context';
import { useApi } from 'hooks';
import Routing from 'pages';
import { Header, Footer } from 'components';
import './App.scss';

const providers = [BrowserRouter, ApiProvider, AccountProvider];

function withProviders(Component: ComponentType) {
  return () => providers.reduce((children, Provider) => <Provider>{children}</Provider>, <Component />);
}

function App() {
  const { isApiReady } = useApi();

  return (
    <>
      <Header />
      <main>{isApiReady ? <Routing /> : <p className="loader">Initializing API...</p>}</main>
      <Footer />
    </>
  );
}

export default withProviders(App);
