import { Route, Routes } from 'react-router-dom';
import { Home } from './home';
import { Store } from './store';

const routes = [
  { path: '/', Page: Home },
  { path: '/store', Page: Store },
];

export const Routing = () => (
  <Routes>
    {routes.map(({ path, Page }) => (
      <Route key={path} path={path} element={<Page />} />
    ))}
  </Routes>
);
