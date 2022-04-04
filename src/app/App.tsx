import Routing from 'pages';
import { Header, Footer } from 'widgets';
import withRouter from './providers';
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

export default withRouter(App);
