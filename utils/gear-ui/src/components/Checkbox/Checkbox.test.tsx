import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Checkbox } from './Checkbox';
import styles from './Checkbox.module.scss';

describe('checkbox tests', () => {
  it('renders checkbox', () => {
    render(<Checkbox label="test label" />);
    const checkbox = screen.getByLabelText('test label');
    expect(checkbox).toBeInTheDocument();
  });

  it('renders switch', () => {
    render(<Checkbox type="switch" label="test label" />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveClass(styles.switch);
  });

  it('applies className to label wrapper', () => {
    render(<Checkbox label="test label" className="className" />);

    const checkbox = screen.getByRole('checkbox');
    const label = screen.getByText('test label');

    expect(checkbox).not.toHaveClass('className');
    expect(label).toHaveClass('className');
  });

  it('renders disabled checkbox', () => {
    render(<Checkbox label="test label" disabled />);

    const checkbox = screen.getByRole('checkbox');
    const label = screen.getByText('test label');

    expect(checkbox).toBeDisabled();
    expect(label).toHaveClass('disabled');
  });

  it('passes ref', () => {
    const ref = { current: null };
    render(<Checkbox label="test label" ref={ref} />);

    const checkbox = screen.getByLabelText('test label');

    expect(ref.current).toBe(checkbox);
  });
});
