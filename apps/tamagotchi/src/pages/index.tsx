import { Route, Routes } from 'react-router-dom';
import { Home } from './home';
import { Store } from './store';
import { Battle } from './battle';
import { useTamagotchi } from '../app/hooks/use-tamagotchi';
import { useThrottleWasmState } from '../app/hooks/use-read-wasm-state';
import { useItemsStore } from '../app/hooks/use-store';

const routes = [
  { path: '/', Page: Home },
  { path: '/store', Page: Store },
  { path: '/battle', Page: Battle },
];

export const Routing = () => {
  useTamagotchi();
  useThrottleWasmState();
  useItemsStore();

  return (
    <Routes>
      {routes.map(({ path, Page }) => (
        <Route key={path} path={path} element={<Page />} />
      ))}
    </Routes>
  );
};
