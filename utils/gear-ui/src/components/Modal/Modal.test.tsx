import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Modal } from './Modal';
import styles from './Modal.module.scss';

const close = vi.fn();

describe('modal tests', () => {
  it('renders modal', () => {
    const { rerender } = render(<Modal heading="test" close={close} />);

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

    expect(modal).toHaveClass('normal');
    expect(modal).not.toHaveClass('large');

    rerender(<Modal heading="test" close={close} size="large" />);

    expect(modal).toHaveClass('large');
    expect(modal).not.toHaveClass('normal');
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

  it('applies className to body', () => {
    render(
      <Modal heading="test" close={close} className="testClassName">
        modal content
      </Modal>,
    );

    const body = screen.getByText('modal content');

    expect(body).toHaveClass(styles.body, 'testClassName');
  });

  it('clicks close button', () => {
    render(<Modal heading="test" close={close} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(close).toHaveBeenCalledTimes(1);
  });

  it('clicks overlay', () => {
    render(<Modal heading="test" close={close} />);

    const overlay = screen.getByTestId('overlay');
    fireEvent.click(overlay);

    expect(close).toHaveBeenCalledTimes(1);
  });

  it('clicks modal', () => {
    render(<Modal heading="test" close={close} />);

    const modal = screen.getByTestId('modal');
    fireEvent.click(modal);

    expect(close).not.toHaveBeenCalled();
  });

  it('closes modal', () => {
    const { unmount } = render(<Modal heading="test" close={close} />);

    const root = document.getElementById('modal-root');

    unmount();
    expect(root).not.toBeInTheDocument();
  });
});
