import { Routes, Route } from 'react-router-dom';

import { routes } from 'shared/config';

const Routing = () => (
  <Routes>
    <Route path={routes.home} element={null} />
  </Routes>
);

export { Routing };
