import { Routes, Route } from 'react-router-dom';

import { routes } from '@/shared/config';

import { Code } from './code';
import { Codes } from './codes';
import { Home } from './home';
import { Program } from './program';
import { Programs } from './programs';

const Routing = () => {
  return (
    <Routes>
      <Route path={routes.home} element={<Home />} />
      <Route path={routes.programs} element={<Programs />} />
      <Route path={routes.program} element={<Program />} />
      <Route path={routes.codes} element={<Codes />} />
      <Route path={routes.code} element={<Code />} />

      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
  );
};

export { Routing };
