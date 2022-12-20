import { Route, Routes } from 'react-router-dom';
import { Home } from './home';

const routes = [{ path: '/', Page: Home }];

export const Routing = () => (
  <Routes>
    {routes.map(({ path, Page }) => (
      <Route key={path} path={path} element={<Page />} />
    ))}
  </Routes>
);
