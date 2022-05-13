import { Header, Footer, Loader, ApiLoader } from 'components';
import { withProviders } from 'context';
import { useApi, useLoading } from 'hooks';
import Routing from 'pages';
import './App.scss';

function App() {
  const { isApiReady } = useApi();
  const { isLoading } = useLoading();

  return (
    <>
      <Header />
      <main>
        {isApiReady ? <Routing /> : <ApiLoader />}
        {isLoading && <Loader />}
      </main>
      <Footer />
    </>
  );
}

export default withProviders(App);
