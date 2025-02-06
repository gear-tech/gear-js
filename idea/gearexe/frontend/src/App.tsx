import './index.css';

import { Header, Layout, Loader, Navigation } from '@/components';
import { Routing } from '@/pages';
import { withProviders } from './app/providers';
import { Activity } from './features/activity/ui/Activity';
import { ErrorBoundary } from './components/error-boundary/error-boundary';

function App() {
  const isAppReady = true;

  return (
    <main className="main">
      <Header />
      <Layout>
        <ErrorBoundary>
          <div>
            <Navigation />
            {isAppReady ? <Routing /> : <Loader />}
          </div>
          <Activity />
        </ErrorBoundary>
      </Layout>
    </main>
  );
}

export default withProviders(App);
