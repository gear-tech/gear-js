import Routing from 'pages';
import { Header, Footer } from 'widgets';
import withProviders from './providers';
import './App.scss';

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
