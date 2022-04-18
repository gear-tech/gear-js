import { Route, Routes } from 'react-router-dom';
import Listing from './listing';
import Listings from './listings';
import Create from './create';

const routes = [
  { path: '/', Page: Listings },
  { path: '/listing', Page: Listing },
  { path: '/create', Page: Create },
];

function Routing() {
  const getRoutes = () => routes.map(({ path, Page }) => <Route key={path} path={path} element={<Page />} />);

  return <Routes>{getRoutes()}</Routes>;
}

export default Routing;
