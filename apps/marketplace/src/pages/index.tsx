import { Route, Routes } from 'react-router-dom';
import { OnLogin, InfoText } from 'components';
import { Listing } from './listing';
import { Listings } from './listings';
import { Create } from './create';
import { Me } from './me';

const routes = [
  { path: '/', Page: Listings },
  { path: '/listing/:id', Page: Listing },
  { path: '/create', Page: Create, isPrivate: true },
  { path: '/me', Page: Me, isPrivate: true },
];

function Routing() {
  const getRoutes = () =>
    routes.map(({ path, Page, isPrivate }) => (
      <Route
        key={path}
        path={path}
        element={
          isPrivate ? (
            <OnLogin fallback={<InfoText text="In order to use all marketplace features, please login" />}>
              <Page />
            </OnLogin>
          ) : (
            <Page />
          )
        }
      />
    ));

  return <Routes>{getRoutes()}</Routes>;
}

export { Routing };
