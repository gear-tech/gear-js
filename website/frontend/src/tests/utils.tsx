import { ReactElement } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import { providers } from 'context';

type Props = {
  children: ReactElement;
};

const Providers = ({ children: element }: Props) =>
  providers.reduceRight((children, Provider) => <Provider children={children} />, element);

const renderWithRouter = (element: ReactElement) => render(element, { wrapper: MemoryRouter });
const renderWithProviders = (element: ReactElement) => render(element, { wrapper: Providers });

const textMatcher = (text: string) => (_content: string, node: Element | null) => {
  const isTextMatches = ({ textContent }: Element) => textContent === text;

  if (node && isTextMatches(node)) {
    return Array.from(node.children).every((child) => !isTextMatches(child));
  }

  return false;
};

export { renderWithRouter, renderWithProviders, textMatcher };
