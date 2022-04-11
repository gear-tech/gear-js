import { fireEvent, render, screen } from '@testing-library/react';
import { buttonStyles } from '@gear-js/ui';
import AccountButton from './AccountButton';

const onClick = jest.fn();

describe('account button tests', () => {
  it('renders and clicks button', () => {
    render(<AccountButton address="123" name="test name" onClick={onClick} />);

    const button = screen.getByRole('button');
    const identicon = document.querySelector(`.${buttonStyles.icon}`); // className since we can't pass test id

    expect(button).toContainElement(identicon as HTMLElement);
    expect(button).toHaveTextContent('test name');
    expect(button).toHaveClass(buttonStyles.secondary);

    fireEvent.click(button);
    expect(onClick).toBeCalledTimes(1);
  });

  it('renders and clicks active button', () => {
    render(<AccountButton address="123" name="test name" onClick={onClick} isActive />);

    const button = screen.getByRole('button');
    const identicon = document.querySelector(`.${buttonStyles.icon}`);

    expect(button).toContainElement(identicon as HTMLElement);
    expect(button).toHaveTextContent('test name');
    expect(button).toHaveClass(buttonStyles.primary);

    fireEvent.click(button);
    expect(onClick).toBeCalledTimes(1);
  });
});
