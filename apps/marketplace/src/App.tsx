import { Header, Footer, ApiLoader, RefreshButton } from 'components';
import { withProviders } from 'context';
import { useApi } from 'hooks';
import Routing from 'pages';
import './App.scss';

function App() {
  const { isApiReady } = useApi();

  return (
    <>
      <Header />
      <main>
        {isApiReady ? <Routing /> : <ApiLoader />}
        <RefreshButton />
      </main>
      <Footer />
    </>
  );
}

export default withProviders(App);
