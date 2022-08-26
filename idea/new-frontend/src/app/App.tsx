import { useApi, useLoggedInAccount } from '@gear-js/react-hooks';

import { useAccountSubscriptions } from 'hooks';
import { Menu } from 'widgets/menu';
import { Header } from 'widgets/header';
import { Footer } from 'widgets/footer';
import { Routing } from 'pages';
import { Loader } from 'shared/ui/loader';

import './App.scss';
import { withProviders } from './providers';

const App = withProviders(() => {
  const { isApiReady } = useApi();
  const { isLoginReady } = useLoggedInAccount();

  useAccountSubscriptions();

  if (!(isApiReady && isLoginReady)) {
    return <Loader />;
  }

  return (
    <>
      <main className="main">
        <Menu />
        <div className="content">
          <Header />
          <Routing />
        </div>
      </main>
      <Footer />
    </>
  );
});

export { App };
