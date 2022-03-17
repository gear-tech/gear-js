import { render, screen } from '@testing-library/react';
import close from 'assets/images/close.svg';
import { Input } from './Input';
import styles from './Input.module.scss';

describe('input tests', () => {
  it('renders input', () => {
    render(<Input />);
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
  });

  it('renders input with label', () => {
    render(<Input label="label" />);
    const input = screen.getByLabelText('label');
    expect(input).toBeInTheDocument();
  });

  it('renders input with icon', () => {
    render(<Input label="label" icon={close} />);

    const label = screen.getByTestId('label');
    const icon = screen.getByRole('img');

    expect(label).toContainElement(icon);
  });

  it('applies className to label wrapper', () => {
    render(<Input label="label" className="class" />);
    const label = screen.getByTestId('label');
    expect(label).toHaveClass('class');
  });

  it('renders read only input', () => {
    render(<Input readOnly />);

    const wrapper = screen.getByTestId('wrapper');
    const input = screen.getByRole('textbox');

    expect(input).toHaveAttribute('readOnly');
    expect(wrapper).toHaveClass(styles.readOnly);
  });

  it('renders disabled input', () => {
    render(<Input disabled />);

    const label = screen.getByTestId('label');
    const input = screen.getByRole('textbox');

    expect(input).toBeDisabled();
    expect(label).toHaveClass('disabled');
  });
});
