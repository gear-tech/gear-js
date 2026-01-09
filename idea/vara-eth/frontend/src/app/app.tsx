import './app.css';

import { ErrorBoundary, Header } from '@/components';
import { Activity } from '@/features/activity';
import { Routing } from '@/pages';

import { withProviders } from './providers';

function Component() {
  return (
    <main>
      <Header />

      <div className="layout">
        <ErrorBoundary>
          <div className="page">
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
