import './index.css';

import { Header, Loader, Navigation } from '@/components';
import { Routing } from '@/pages';
import { withProviders } from './app/providers';
import { Activity } from './features/activity/ui/Activity';
import { ErrorBoundary } from './components/error-boundary/error-boundary';

function App() {
  const isAppReady = true;

  return (
    <main>
      <Header />
      <div className="main-layout">
        <ErrorBoundary>
          <div>
            <Navigation />
            {isAppReady ? <Routing /> : <Loader />}
          </div>
          <Activity />
        </ErrorBoundary>
      </div>
    </main>
  );
}

export default withProviders(App);
