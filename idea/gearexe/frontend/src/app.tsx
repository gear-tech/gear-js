import './index.css';

import { ErrorBoundary, Header, Loader, Navigation } from '@/components';
import { Routing } from '@/pages';

import { withProviders } from './app/providers';
import { Activity } from './features/activity';
import { Search } from './features/search';

function Component() {
  const isAppReady = true;

  return (
    <main>
      <Header />
      <div className="layout">
        <ErrorBoundary>
          <div>
            <Navigation search={<Search />} />
            {isAppReady ? <Routing /> : <Loader />}
          </div>
          <Activity />
        </ErrorBoundary>
      </div>
    </main>
  );
}

const App = withProviders(Component);

export { App };
