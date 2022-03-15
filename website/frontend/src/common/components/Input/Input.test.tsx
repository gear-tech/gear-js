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
    const icon = screen.getByAltText('input icon');

    expect(label).toContainElement(icon);
  });

  it('applies className to label wrapper', () => {
    render(<Input label="label" className="class" />);
    const label = screen.getByTestId('label');
    expect(label).toHaveClass('class');
  });

  it('applies read only styles to input wrapper', () => {
    render(<Input readOnly />);
    const wrapper = screen.getByTestId('wrapper');
    expect(wrapper).toHaveClass(styles.readOnly);
  });
});
