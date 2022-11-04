import { render, screen } from '@testing-library/react';
import { Button } from './Button';
import styles from './Button.module.scss';

const ArrowIcon = () => <svg data-testid="svg" />;

describe('button tests', () => {
  it('renders button', () => {
    render(<Button text="button text" />);

    const button = screen.getByRole('button');

    expect(button).toHaveTextContent('button text');
    expect(button).toHaveAttribute('type', 'button');
  });

  it('render submit button', () => {
    render(<Button type="submit" text="button text" />);

    const button = screen.getByRole('button');

    expect(button).toHaveTextContent('button text');
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('renders icon button', () => {
    render(<Button icon={ArrowIcon} />);

    const button = screen.getByRole('button');
    const icon = screen.getByTestId('svg');

    expect(button).toContainElement(icon);
    expect(button).toHaveClass(styles.noText);
  });

  it('renders button with icon and text', () => {
    render(<Button text="button text" icon={ArrowIcon} />);

    const button = screen.getByText('button text');
    const icon = screen.getByTestId('svg');

    expect(button).toContainElement(icon);
    expect(button).toHaveClass(styles.medium);
  });

  it('renders small/large button with secondary, light and gradient colors', () => {
    const { rerender } = render(<Button text="button text" color="secondary" size="small" />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass(styles.secondary, styles.small);

    rerender(<Button text="button text" color="light" size="small" />);
    expect(button).toHaveClass(styles.light, styles.small);

    rerender(<Button text="button text" color="lightGreen" size="large" />);
    expect(button).toHaveClass(styles.lightGreen, styles.large);

    rerender(<Button text="button text" color="gradient" size="large" />);
    expect(button).toHaveClass(styles.gradient, styles.large);
  });

  it('renders button with transparent background', () => {
    render(<Button text="button text" color="transparent" />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass(styles.transparent);
  });

  it('renders no wrap block button', () => {
    render(<Button text="button text" block noWrap />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass(styles.block, styles.noWrap);
  });

  it('passes ref', () => {
    const ref = { current: null };
    render(<Button text="button text" ref={ref} />);

    const button = screen.getByRole('button');

    expect(ref.current).toBe(button);
  });
});
