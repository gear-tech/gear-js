import { ReactElement } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

export const renderWithRouter = (element: ReactElement) => render(element, { wrapper: MemoryRouter });
