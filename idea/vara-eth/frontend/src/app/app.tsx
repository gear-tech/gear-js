import './app.css';

import { ErrorBoundary, Header, Navigation } from '@/components';
import { Activity } from '@/features/activity';
import { Routing } from '@/pages';

import { withProviders } from './providers';

function Component() {
  return (
    <main>
      <Header />

      <div className="layout">
        <ErrorBoundary>
          <div>
            <Navigation />
            <Routing />
          </div>

          <Activity />
        </ErrorBoundary>
      </div>
    </main>
  );
}

const App = withProviders(Component);

export { App };
