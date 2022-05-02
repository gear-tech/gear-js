import { Route, Routes } from 'react-router-dom';
import Listing from './listing';
// import Listings from './listings';
import Create from './create';
import Me from './me';

const routes = [
  // { path: '/', Page: Listings },
  { path: '/listing', Page: Listing },
  { path: '/create', Page: Create },
  { path: '/me', Page: Me },
];

function Routing() {
  const getRoutes = () => routes.map(({ path, Page }) => <Route key={path} path={path} element={<Page />} />);

  return <Routes>{getRoutes()}</Routes>;
}

export default Routing;
