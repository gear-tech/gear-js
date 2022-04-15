import { ReactElement } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import { AccountProvider } from 'context';

function renderWithRouter(element: ReactElement) {
  return render(element, { wrapper: MemoryRouter });
}

function renderWithAccountProvider(element: ReactElement) {
  return render(element, { wrapper: AccountProvider });
}

function textMatcher(text: string) {
  return (_content: string, node: Element | null) => {
    const isTextMatches = ({ textContent }: Element) => textContent === text;

    if (node && isTextMatches(node)) {
      return Array.from(node.children).every((child) => !isTextMatches(child));
    }

    return false;
  };
}

export { renderWithRouter, renderWithAccountProvider, textMatcher };
