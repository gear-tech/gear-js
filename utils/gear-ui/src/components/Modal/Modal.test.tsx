import { fireEvent, render, screen } from '@testing-library/react';
import { Modal } from './Modal';

const close = jest.fn();

describe('modal tests', () => {
  it('renders modal', () => {
    render(<Modal heading="test" close={close} />);

    const root = document.getElementById('modal-root');
    const overlay = screen.getByTestId('overlay');
    const modal = screen.getByTestId('modal');
    const heading = screen.getByRole('heading');
    const button = screen.getByRole('button');
    const body = screen.queryByTestId('body');

    expect(root).toContainElement(overlay);
    expect(overlay).toContainElement(modal);

    expect(modal).toContainElement(heading);
    expect(heading).toHaveTextContent('test');

    expect(modal).toContainElement(button);
    expect(body).not.toBeInTheDocument();
  });

  it('renders modal with content', () => {
    render(
      <Modal heading="test" close={close}>
        <p>modal content</p>
      </Modal>,
    );

    const root = document.getElementById('modal-root');
    const overlay = screen.getByTestId('overlay');
    const modal = screen.getByTestId('modal');
    const heading = screen.getByRole('heading');
    const button = screen.getByRole('button');

    const body = screen.getByTestId('body');
    const content = screen.getByText('modal content');

    expect(root).toContainElement(overlay);
    expect(overlay).toContainElement(modal);

    expect(modal).toContainElement(heading);
    expect(heading).toHaveTextContent('test');

    expect(modal).toContainElement(button);

    expect(modal).toContainElement(body);
    expect(body).toContainElement(content);
  });

  it('clicks close button', () => {
    render(<Modal heading="test" close={close} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(close).toBeCalledTimes(1);
  });

  it('clicks overlay', () => {
    render(<Modal heading="test" close={close} />);

    const overlay = screen.getByTestId('overlay');
    fireEvent.click(overlay);

    expect(close).toBeCalledTimes(1);
  });

  it('clicks modal', () => {
    render(<Modal heading="test" close={close} />);

    const modal = screen.getByTestId('modal');
    fireEvent.click(modal);

    expect(close).not.toBeCalled();
  });

  it('closes modal', () => {
    const { unmount } = render(<Modal heading="test" close={close} />);

    const root = document.getElementById('modal-root');

    unmount();
    expect(root).not.toBeInTheDocument();
  });
});
