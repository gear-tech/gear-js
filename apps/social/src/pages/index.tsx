import { Route, Routes } from 'react-router-dom';
import { Home } from './home';
import { Channels } from './channels';
import { Channel } from './channel';

const routes = [
  { path: '/', Page: Home },
  { path: 'channel/:id', Page: Channel },
  { path: 'all/', Page: Channels },
];

function Routing() {
  const getRoutes = () => routes.map(({ path, Page }) => <Route key={path} path={path} element={<Page />} />);

  return <Routes>{getRoutes()}</Routes>;
}

export { Routing };
