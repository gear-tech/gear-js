import { ReactElement } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import { ModalProvider } from 'context/modal';
import { AlertProvider } from 'context/alert';
import { AccountProvider, ApiProvider } from '@gear-js/react-hooks';

type Props = {
  children: ReactElement;
};

const providers = [AlertProvider, ModalProvider, ApiProvider, AccountProvider];

const Providers = ({ children: element }: Props) =>
  providers.reduceRight((children, Provider) => <Provider>{children}</Provider>, element);

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
