import './app.css';

import { ErrorBoundary, Header, Navigation } from '@/components';
import { Activity } from '@/features/activity';
import { useCodeValidationPolling } from '@/features/codes';
import { Routing } from '@/pages';

import { useApiCleanup } from './api';
import { withProviders } from './providers';

function Component() {
  useApiCleanup();
  useCodeValidationPolling();

  return (
    <>
      <Header />

      <main>
        <ErrorBoundary>
          <div className="content">
            <Navigation />
            <Routing />
          </div>

          <Activity />
        </ErrorBoundary>
      </main>
    </>
  );
}

const App = withProviders(Component);

export { App };
