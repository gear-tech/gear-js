import { useApi, useBalanceSubscription, useLoggedInAccount } from '@gear-js/react-hooks';
import { Routing } from 'pages';
import { Header, Footer, ApiLoader } from 'components';
import { withProviders } from 'hocs';
import 'App.scss';

function Component() {
  const { isLoginReady } = useLoggedInAccount();
  const { isApiReady } = useApi();
  const isInitLoading = isApiReady && isLoginReady;

  useBalanceSubscription();
  useLoggedInAccount();

  return (
    <>
      <Header />
      <main>{isInitLoading ? <Routing /> : <ApiLoader />}</main>
      <Footer />
    </>
  );
}

export const App = withProviders(Component);
