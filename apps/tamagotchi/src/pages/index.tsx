import { Route, Routes } from 'react-router-dom';
import { Home } from './home';
import { Store } from './store';
import { Battle } from './battle';

const routes = [
  { path: '/', Page: Home },
  { path: '/store', Page: Store },
  { path: '/battle', Page: Battle },
];

export const Routing = () => (
  <Routes>
    {routes.map(({ path, Page }) => (
      <Route key={path} path={path} element={<Page />} />
    ))}
  </Routes>
);
