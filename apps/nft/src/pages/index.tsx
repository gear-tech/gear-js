import { Route, Routes } from 'react-router-dom';
import { Create } from './create';
import { Home } from './home';
import { NFT } from './nft';

const routes = [
  { path: '/', Page: Home },
  { path: 'nft/:id', Page: NFT },
  { path: 'create', Page: Create },
];

function Routing() {
  const getRoutes = () => routes.map(({ path, Page }) => <Route key={path} path={path} element={<Page />} />);

  return <Routes>{getRoutes()}</Routes>;
}

export { Routing };
