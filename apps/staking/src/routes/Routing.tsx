import { Route, Routes } from 'react-router-dom';

import { Home } from 'pages/home';
import { MainLayout } from 'components/layout/main';

import { routes } from './const';

function Routing() {
  return (
    <Routes>
      <Route path={routes.home} element={<MainLayout />}>
        <Route index element={<Home />} />
      </Route>
    </Routes>
  );
}

export { Routing };
