import { ComponentType } from 'react';
import { BrowserRouter } from 'react-router-dom';

function withRouter(Component: ComponentType) {
  return function WithRouter() {
    return (
      <BrowserRouter>
        <Component />
      </BrowserRouter>
    );
  };
}

export default withRouter;
