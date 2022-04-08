import { ReactElement } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

function renderWithRouter(element: ReactElement) {
  return render(element, { wrapper: MemoryRouter });
}

export default renderWithRouter;
