import './app.css';

import { ErrorBoundary, Header, Navigation } from '@/components';
import { Activity } from '@/features/activity';
import { Routing } from '@/pages';

import { withProviders } from './providers';

function Component() {
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
