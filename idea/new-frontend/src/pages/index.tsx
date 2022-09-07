import { Routes, Route } from 'react-router-dom';

import { routes } from 'shared/config';

import { Home } from './home';
import { Program } from './program';
import { Programs } from './programs';
import { NotFound } from './notFound';

const Routing = () => (
  <Routes>
    <Route path={routes.home} element={<Home />} />

    <Route path={routes.programs}>
      <Route index element={<Programs />} />
      <Route path={routes.program} element={<Program />} />
    </Route>

    <Route path="*" element={<NotFound />} />
  </Routes>
);

export { Routing };
