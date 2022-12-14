import { useApi } from '@gear-js/react-hooks';
import { Header, Footer, ApiLoader } from 'components';
import { withProviders } from 'hocs';
import 'App.scss';
import { Home } from 'pages/home';

function Component() {
  const { isApiReady } = useApi();
  return (
    <>
      <Header />
      <main>{(isApiReady) ? <Home /> : <ApiLoader />}</main>
      <Footer />
    </>
  );
}

export const App = withProviders(Component);
