import { ComponentType } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AccountProvider } from 'context';
import Routing from 'pages';
import { Header, Footer } from 'components';
import './App.scss';

const providers = [BrowserRouter, AccountProvider];

function withProviders(Component: ComponentType) {
  return function WithProvider() {
    return providers.reduce(
      (component, Provider) => <Provider>{component}</Provider>,
      <Component />
    );
  };
}

function App() {
  return (
    <>
      <Header />
      <main>
        <Routing />
      </main>
      <Footer />
    </>
  );
}

export default withProviders(App);
