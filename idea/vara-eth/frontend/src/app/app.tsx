import './app.css';

import { ErrorBoundary, Header, Loader } from '@/components';
import { Routing } from '@/pages';

import { Activity } from '../features/activity';

import { withProviders } from './providers';

function Component() {
  const isAppReady = true;

  return (
    <main>
      <Header />
      <div className="layout">
        <ErrorBoundary>
          <div>{isAppReady ? <Routing /> : <Loader />}</div>
          <Activity />
        </ErrorBoundary>
      </div>
    </main>
  );
}

const App = withProviders(Component);

export { App };
