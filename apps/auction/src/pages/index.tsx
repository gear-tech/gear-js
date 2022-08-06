import { useAccount } from '@gear-js/react-hooks';
import { Content, Info } from 'components';
import { Route, Routes } from 'react-router-dom';
import { Home } from './home';

const routes = [{ path: '/', Page: Home }];

function Routing() {
  const { account } = useAccount();
  const getRoutes = () =>
    routes.map(({ path, Page }) => (
      <Route
        key={path}
        path={path}
        element={
          account ? (
            <Page />
          ) : (
            <Content heading="No account">
              <Info text="In order to use app, please login" />
            </Content>
          )
        }
      />
    ));

  return <Routes>{getRoutes()}</Routes>;
}

export { Routing };
