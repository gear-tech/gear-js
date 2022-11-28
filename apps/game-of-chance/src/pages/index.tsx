import { useAccount } from '@gear-js/react-hooks';
import { Content } from 'components';
import { SUBHEADING } from 'consts';
import { Route, Routes } from 'react-router-dom';
import { Home } from './home';

const routes = [{ path: '/', Page: Home }];

function Routing() {
  const { account } = useAccount();

  const getRoutes = () =>
    routes.map(({ path, Page }) => (
      <Route key={path} path={path} element={account ? <Page /> : <Content subheading={SUBHEADING.LOGIN} />} />
    ));

  return <Routes>{getRoutes()}</Routes>;
}

export { Routing };
