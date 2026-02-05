import './app.css';

import { useState } from 'react';

import { ErrorBoundary, Header, Navigation } from '@/components';
import { Activity } from '@/features/activity';
import { Routing } from '@/pages';
import { cx } from '@/shared/utils';

import { withProviders } from './providers';

function Component() {
  const [isActivityOpen, setIsActivityOpen] = useState(true);

  return (
    <>
      <Header />

      <main>
        <ErrorBoundary>
          <div className={cx('page', isActivityOpen && 'activity')}>
            <Navigation />
            <Routing />
          </div>

          <Activity
            isOpen={isActivityOpen}
            onToggleClick={() => setIsActivityOpen((prevValue) => !prevValue)}
            onTabChange={() => setIsActivityOpen(true)}
          />
        </ErrorBoundary>
      </main>
    </>
  );
}

const App = withProviders(Component);

export { App };
