import { Header, Footer, ApiLoader } from 'components';
import { Routing } from 'pages';
import { withProviders } from 'context';
import { useApi } from 'hooks';
import 'App.scss';

function Component() {
  const { isApiReady } = useApi();

  return (
    <>
      <Header />
      <main>{isApiReady ? <Routing /> : <ApiLoader />}</main>
      <Footer />
    </>
  );
}

export const App = withProviders(Component);
